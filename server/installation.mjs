import { randomUUID } from 'node:crypto';
import express from 'express';
import nodemailer from 'nodemailer';

const recipient = 'umt1@ukr.net';
const photoLimit = 10 * 1024 * 1024;
const uploadLimit = photoLimit + 64 * 1024;
const rateWindow = 10 * 60_000;

export function installationMail(env = process.env) {
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

    const name = textField(data, 'name', 80);
    const phone = textField(data, 'phone', 25);
    const objectType = textField(data, 'objectType', 80);
    const description = textField(data, 'description', 1600);
    if (!name || !phone || phone.replace(/\D/g, '').length < 7 || !objectType || !description) {
      return res.sendStatus(400);
    }

    const attachments = [];
    const photo = data.get('photo');
    if (photo !== null) {
      if (!(photo instanceof File) || photo.size === 0) return res.sendStatus(400);
      if (photo.size > photoLimit) return res.sendStatus(413);
      const content = Buffer.from(await photo.arrayBuffer());
      const extension = imageExtension(content);
      if (!extension) return res.sendStatus(415);
      attachments.push({filename: 'photo.' + extension, content});
    }

    const id = randomUUID().slice(0, 8).toUpperCase();
    try {
      await sendMail({
        to: recipient,
        subject: 'Girlyanda · Заявка на монтаж ' + id,
        text: [
          'Заявка ' + id,
          'Ім’я: ' + name,
          'Телефон: ' + phone,
          'Тип об’єкта: ' + objectType,
          '',
          description,
        ].join('\n'),
        attachments,
      });
    } catch (error) {
      console.error('Installation mail failed', error?.code ?? 'SMTP_ERROR');
      return res.sendStatus(502);
    }
    res.status(201).json({id});
  });

  return router;
}

function textField(data, key, maxLength) {
  const value = data.get(key);
  if (typeof value !== 'string' || value.length > maxLength) return '';
  return value.trim();
}

function imageExtension(content) {
  if (content.length >= 12 && content.toString('ascii', 0, 4) === 'RIFF' && content.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (content.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png';
  if (content.subarray(0, 3).toString('hex') === 'ffd8ff') return 'jpg';
  return '';
}
