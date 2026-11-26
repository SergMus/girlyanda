import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from '../server/cloudflare-worker.mjs';
import { configureMail } from '../server/mail.mjs';
import { createFormData } from '../src/app/shared/form-data.ts';

const CONFIG = {
  GIRLYANDA_RESEND_API_KEY: 'test-key',
  GIRLYANDA_RESEND_FROM: 'no-reply@example.com',
};

const REQUEST = {
  to: 'studio@example.net',
  subject: 'Installation request',
  text: 'Please light the terrace.',
  attachments: [],
};

afterEach(() => vi.unstubAllGlobals());

describe('Resend installation mail', () => {
  it('sends the text and an exact copy of the photo as an attachment', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(Response.json({ id: 'email-id' }));
    vi.stubGlobal('fetch', fetchEmail);
    const photo = Buffer.from('89504e470d0a1a0a', 'hex');
    const sendMail = configureMail({ ...CONFIG, GIRLYANDA_SMTP_PASSWORD: 'unused' });

    await sendMail({ ...REQUEST, attachments: [{ filename: 'photo.png', content: photo }] });

    expect(fetchEmail).toHaveBeenCalledExactlyOnceWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer test-key', 'Content-Type': 'application/json' },
      }),
    );
    expect(JSON.parse(await fetchEmail.mock.calls[0][1].body.text())).toEqual({
      ...REQUEST,
      from: 'Girlyanda <no-reply@example.com>',
      to: ['studio@example.net'],
      attachments: [{ filename: 'photo.png', content: photo.toString('base64') }],
    });
  });

  it('reports a provider rejection without retrying through SMTP', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(new Response('Rate limit exceeded', { status: 429 }));
    vi.stubGlobal('fetch', fetchEmail);
    const sendMail = configureMail({ ...CONFIG, GIRLYANDA_SMTP_PASSWORD: 'unused' });

    await expect(sendMail(REQUEST)).rejects.toMatchObject({ code: 'RESEND_HTTP_429' });
    expect(fetchEmail).toHaveBeenCalledTimes(1);
  });

  it('disables a Resend configuration without a sender address', () => {
    expect(configureMail({ GIRLYANDA_RESEND_API_KEY: 'test-key' })).toBeUndefined();
  });
});

describe('Cloudflare order route', () => {
  const env = { ...CONFIG, INSTALLATION_LIMIT: { limit: async () => ({ success: true }) } };
  const requestId = 'abcdef01-2345-4678-9abc-def012345678';

  function orderRequest(lines) {
    const fields = createFormData({
      requestId,
      name: 'Тест',
      phone: '+380000000000',
      city: 'Київ',
      delivery: 'Відділення № 1',
      lines: JSON.stringify(lines),
    });

    return new Request('https://example.com/api/orders', { method: 'POST', body: fields });
  }

  it('sends the delivery details and cart lines to the store with a stable order number', async () => {
    const fetchEmail = vi.fn().mockImplementation(() => Response.json({ id: 'email-id' }));
    vi.stubGlobal('fetch', fetchEmail);

    const lines = [
      { sku: 'GY-P100-WW-WH', quantity: 2, priceKopiykas: 1 },
      { sku: 'GY-S14-2-WW', quantity: 1 },
    ];

    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await worker.fetch(orderRequest(lines), env);
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ id: 'ABCDEF01' });
    }

    for (const [url, { headers, body }] of fetchEmail.mock.calls) {
      expect(url).toBe('https://api.resend.com/emails');
      expect(headers['Idempotency-Key']).toBe('order/' + requestId);
      const email = JSON.parse(await body.text());
      expect(email).toMatchObject({
        to: ['umt1@ukr.net'],
        subject: 'Girlyanda · Замовлення ABCDEF01',
        attachments: [],
      });
      expect(email.text.replace(/[\u00a0\u202f]/g, ' ')).toBe(
        [
          'Замовлення ABCDEF01',
          'Ім’я: Тест',
          'Телефон: +380000000000',
          'Місто: Київ',
          'Відділення або адреса: Відділення № 1',
          '',
          'Товари:',
          '1. Гірлянда нитка 10 м (GY-P100-WW-WH)',
          '   Кількість: 2 шт.',
          '   Ціна за шт.: 1 893,41 грн',
          '   Сума позиції: 3 786,82 грн',
          '2. Ретрогірлянда Belt light S14 (GY-S14-2-WW)',
          '   Кількість: 1 шт.',
          '   Ціна за шт.: 1 900,00 грн',
          '   Сума позиції: 1 900,00 грн',
          '',
          'Разом за товари: 5 686,82 грн',
        ].join('\n'),
      );
    }
    expect(fetchEmail).toHaveBeenCalledTimes(2);
  });

  it.each([
    { reason: 'an empty cart', lines: [] },
    { reason: 'an excessive quantity', lines: [{ sku: 'GY-P100-WW-WH', quantity: 100 }] },
    {
      reason: 'a repeated SKU',
      lines: [
        { sku: 'GY-P100-WW-WH', quantity: 1 },
        { sku: 'GY-P100-WW-WH', quantity: 2 },
      ],
    },
    { reason: 'an unknown SKU', lines: [{ sku: 'GY-UNKNOWN', quantity: 1 }] },
  ])('rejects $reason before sending email', async ({ lines }) => {
    const fetchEmail = vi.fn();
    vi.stubGlobal('fetch', fetchEmail);

    const response = await worker.fetch(orderRequest(lines), env);

    expect(response.status).toBe(400);
    expect(fetchEmail).not.toHaveBeenCalled();
  });

  it('accepts an order for a SKU from an older saved cart', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(Response.json({ id: 'email-id' }));
    vi.stubGlobal('fetch', fetchEmail);

    const response = await worker.fetch(orderRequest([{ sku: 'GY-K090-WW-BK', quantity: 1 }]), env);

    expect(response.status).toBe(201);
    expect(fetchEmail).toHaveBeenCalledTimes(1);
  });
});

describe('Cloudflare installation route', () => {
  const env = { ...CONFIG, INSTALLATION_LIMIT: { limit: async () => ({ success: true }) } };

  function installationRequest(photo) {
    const fields = createFormData({
      name: 'Тест',
      phone: '+380000000000',
      objectType: 'Будинок',
      description: 'Тестова заявка',
    });
    fields.set('photo', new Blob([photo], { type: 'image/png' }), 'test.png');

    return new Request('https://example.com/api/installation', { method: 'POST', body: fields });
  }

  it('accepts the maximum photo size and passes the original bytes to Resend', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(Response.json({ id: 'email-id' }));
    vi.stubGlobal('fetch', fetchEmail);
    const photo = Buffer.alloc(10 * 1024 * 1024, 0x8a);
    Buffer.from('89504e470d0a1a0a', 'hex').copy(photo);

    const response = await worker.fetch(installationRequest(photo), env);

    expect(response.status).toBe(201);
    expect((await response.json()).id).toMatch(/^[0-9A-F]{8}$/);
    const payload = JSON.parse(await fetchEmail.mock.calls[0][1].body.text());
    expect(payload.attachments).toEqual([{ filename: 'photo.png', content: photo.toString('base64') }]);
  });

  it('rejects oversized request bodies without contacting Resend', async () => {
    const fetchEmail = vi.fn();
    vi.stubGlobal('fetch', fetchEmail);

    const oversized = new Request('https://example.com/api/installation', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=test-boundary' },
      body: new Uint8Array(11 * 1024 * 1024),
    });

    const response = await worker.fetch(oversized, env);

    expect(response.status).toBe(413);
    expect(fetchEmail).not.toHaveBeenCalled();
  });
});
