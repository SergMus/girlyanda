import { fileURLToPath } from 'node:url';
import express from 'express';
import { installationMail, installationRoute } from './installation.mjs';

const app = express();
const browser = fileURLToPath(new URL('../dist/girlyanda/browser/', import.meta.url));
const sendMail = installationMail();
const port = Number(process.env.GIRLYANDA_SERVER_PORT || 4300);
const host = process.env.GIRLYANDA_SERVER_HOST || '127.0.0.1';

app.disable('x-powered-by');
app.use('/api/installation', installationRoute(sendMail));
app.use('/api', (_req, res) => res.sendStatus(404));
app.use(express.static(browser));
app.get('/{*path}', (req, res) => {
  if (!req.accepts('html')) return res.sendStatus(404);
  res.sendFile('index.csr.html', {root: browser});
});

app.listen(port, host, () => {
  console.log('Girlyanda: http://' + host + ':' + port);
  if (!sendMail) console.log('Installation email is disabled until GIRLYANDA_SMTP_PASSWORD is configured.');
});
