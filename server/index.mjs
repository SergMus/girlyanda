import { fileURLToPath } from 'node:url';
import express from 'express';
import { installationSubmission } from './installation-request.mjs';
import { configureMail, submissionRoute } from './mail.mjs';
import { orderSubmission } from './order-request.mjs';

const app = express();
const browser = fileURLToPath(new URL('../dist/girlyanda/browser/', import.meta.url));
const sendMail = configureMail();
const port = Number(process.env.GIRLYANDA_SERVER_PORT || 4300);
const host = process.env.GIRLYANDA_SERVER_HOST || '127.0.0.1';

app.disable('x-powered-by');
app.use('/api/installation', submissionRoute(sendMail, installationSubmission));
app.use('/api/orders', submissionRoute(sendMail, orderSubmission));
app.use('/api', (_req, res) => res.sendStatus(404));
app.use(express.static(browser));
app.get('/{*path}', (req, res) => {
  if (!req.accepts('html')) return res.sendStatus(404);
  res.sendFile('index.csr.html', {root: browser});
});

app.listen(port, host, () => {
  console.log('Girlyanda: http://' + host + ':' + port);
  if (!sendMail) console.log('Email requires a Resend API key and sender address, or an SMTP password.');
});
