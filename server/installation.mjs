import express from 'express';
import nodemailer from 'nodemailer';
import { installationMessage, recipient, uploadLimit } from './installation-request.mjs';
import { sendResendEmail } from './resend.mjs';

const rateWindow = 10 * 60_000;

export function installationMail(env = process.env) {
  const resendKey = env.GIRLYANDA_RESEND_API_KEY?.trim();
  if (resendKey) {
    const from = env.GIRLYANDA_RESEND_FROM?.trim();
    if (!from) return undefined;
    return message => sendResendEmail(resendKey, from, message);
  }

  const password = env.GIRLYANDA_SMTP_PASSWORD;
  if (!password) return undefined;

  const user = env.GIRLYANDA_SMTP_USER || recipient;
  const transport = nodemailer.createTransport({
    host: env.GIRLYANDA_SMTP_HOST || 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {user, pass: password},
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  return async message => {
    const result = await transport.sendMail({...message, from: {name: 'Girlyanda', address: user}});
    if (!result.accepted.includes(recipient)) throw new Error('Recipient rejected');
  };
}

export function installationRoute(sendMail) {
  const router = express.Router();
  const attempts = new Map();
  let nextCleanup = Date.now() + rateWindow;

  router.post('/', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (req.get('Sec-Fetch-Site') === 'cross-site') return res.sendStatus(403);
    if (!sendMail) return res.sendStatus(503);
    if (!req.is('multipart/form-data')) return res.sendStatus(415);

    const now = Date.now();
    if (now >= nextCleanup) {
      for (const [ip, attempt] of attempts) {
        if (attempt.until <= now) attempts.delete(ip);
      }
      nextCleanup = now + rateWindow;
    }
    const previous = attempts.get(req.ip);
    const attempt = previous?.until > now ? previous : {count: 0, until: now + rateWindow};
    if (attempt.count >= 6) {
      res.set('Retry-After', String(Math.ceil((attempt.until - now) / 1000)));
      return res.sendStatus(429);
    }
    attempt.count++;
    attempts.set(req.ip, attempt);
    next();
  }, express.raw({type: 'multipart/form-data', limit: uploadLimit, inflate: false}), async (req, res) => {
    let data;
    try {
      data = await new Request('http://localhost', {
        method: 'POST',
        headers: {'content-type': req.get('Content-Type')},
        body: req.body,
      }).formData();
    } catch {
      return res.sendStatus(400);
    }

    const result = await installationMessage(data);
    if ('status' in result) return res.sendStatus(result.status);
    try {
      await sendMail(result.message);
    } catch (error) {
      console.error('Installation mail failed', error?.code ?? 'MAIL_ERROR');
      return res.sendStatus(502);
    }
    res.status(201).json({id: result.id});
  });

  return router;
}
