import { fileURLToPath } from 'node:url';
import express from 'express';
import { INSTALLATION_SUBMISSION } from './installation-request.mjs';
import { configureMail, submissionRoute } from './mail.mjs';
import { ORDER_SUBMISSION } from './order-request.mjs';

const APP = express();
const BROWSER = fileURLToPath(new URL('../dist/girlyanda/browser/', import.meta.url));
const SEND_MAIL = configureMail();
const PORT = Number(process.env.GIRLYANDA_SERVER_PORT || 4300);
const HOST = process.env.GIRLYANDA_SERVER_HOST || '127.0.0.1';

APP.disable('x-powered-by');
APP.use('/api/installation', submissionRoute(SEND_MAIL, INSTALLATION_SUBMISSION));
APP.use('/api/orders', submissionRoute(SEND_MAIL, ORDER_SUBMISSION));
APP.use('/api', (_req, res) => res.sendStatus(404));
APP.use(express.static(BROWSER));

APP.get('/{*path}', (req, res) => {
  if (!req.accepts('html')) {
    return res.sendStatus(404);
  }

  res.sendFile('index.csr.html', { root: BROWSER });
});

APP.listen(PORT, HOST, () => {
  console.log('Girlyanda: http://' + HOST + ':' + PORT);

  if (!SEND_MAIL) {
    console.log('Email requires a Resend API key and sender address, or an SMTP password.');
  }
});
