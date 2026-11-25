import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from '../server/cloudflare-worker.mjs';
import { installationMail } from '../server/installation.mjs';

const config = {
  GIRLYANDA_RESEND_API_KEY: 'test-key',
  GIRLYANDA_RESEND_FROM: 'no-reply@example.com',
};

const request = {
  to: 'studio@example.net',
  subject: 'Installation request',
  text: 'Please light the terrace.',
  attachments: [],
};

afterEach(() => vi.unstubAllGlobals());

describe('Resend installation mail', () => {
  it('sends the text and an exact copy of the photo as an attachment', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(Response.json({id: 'email-id'}));
    vi.stubGlobal('fetch', fetchEmail);
    const photo = Buffer.from('89504e470d0a1a0a', 'hex');
    const sendMail = installationMail({...config, GIRLYANDA_SMTP_PASSWORD: 'unused'});

    await sendMail({...request, attachments: [{filename: 'photo.png', content: photo}]});

    expect(fetchEmail).toHaveBeenCalledExactlyOnceWith('https://api.resend.com/emails', expect.objectContaining({
      method: 'POST',
      headers: {Authorization: 'Bearer test-key', 'Content-Type': 'application/json'},
    }));
    expect(JSON.parse(await fetchEmail.mock.calls[0][1].body.text())).toEqual({
      ...request,
      from: 'Girlyanda <no-reply@example.com>',
      to: ['studio@example.net'],
      attachments: [{filename: 'photo.png', content: photo.toString('base64')}],
    });
  });

  it('reports a provider rejection without retrying through SMTP', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(new Response('Rate limit exceeded', {status: 429}));
    vi.stubGlobal('fetch', fetchEmail);
    const sendMail = installationMail({...config, GIRLYANDA_SMTP_PASSWORD: 'unused'});

    await expect(sendMail(request)).rejects.toMatchObject({code: 'RESEND_HTTP_429'});
    expect(fetchEmail).toHaveBeenCalledTimes(1);
  });

  it('disables a Resend configuration without a sender address', () => {
    expect(installationMail({GIRLYANDA_RESEND_API_KEY: 'test-key'})).toBeUndefined();
  });
});

describe('Cloudflare installation route', () => {
  const env = {...config, INSTALLATION_LIMIT: {limit: async () => ({success: true})}};

  function installationRequest(photo) {
    const fields = new FormData();
    fields.set('name', 'Тест');
    fields.set('phone', '+380000000000');
    fields.set('objectType', 'Будинок');
    fields.set('description', 'Тестова заявка');
    fields.set('photo', new Blob([photo], {type: 'image/png'}), 'test.png');
    return new Request('https://example.com/api/installation', {method: 'POST', body: fields});
  }

  it('accepts the maximum photo size and passes the original bytes to Resend', async () => {
    const fetchEmail = vi.fn().mockResolvedValue(Response.json({id: 'email-id'}));
    vi.stubGlobal('fetch', fetchEmail);
    const photo = Buffer.alloc(10 * 1024 * 1024, 0x8a);
    Buffer.from('89504e470d0a1a0a', 'hex').copy(photo);

    const response = await worker.fetch(installationRequest(photo), env);

    expect(response.status).toBe(201);
    expect((await response.json()).id).toMatch(/^[0-9A-F]{8}$/);
    const payload = JSON.parse(await fetchEmail.mock.calls[0][1].body.text());
    expect(payload.attachments).toEqual([{filename: 'photo.png', content: photo.toString('base64')}]);
  });

  it('rejects oversized request bodies without contacting Resend', async () => {
    const fetchEmail = vi.fn();
    vi.stubGlobal('fetch', fetchEmail);
    const oversized = new Request('https://example.com/api/installation', {
      method: 'POST',
      headers: {'Content-Type': 'multipart/form-data; boundary=test-boundary'},
      body: new Uint8Array(11 * 1024 * 1024),
    });
    const response = await worker.fetch(oversized, env);

    expect(response.status).toBe(413);
    expect(fetchEmail).not.toHaveBeenCalled();
  });
});
