import { afterEach, describe, expect, it, vi } from 'vitest';
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
    expect(JSON.parse(fetchEmail.mock.calls[0][1].body)).toEqual({
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
