import { spawn } from 'node:child_process';

const api = spawn(process.execPath, ['--env-file-if-exists=.env', 'server/index.mjs'], {
  env: {...process.env, GIRLYANDA_SERVER_HOST: '127.0.0.1', GIRLYANDA_SERVER_PORT: '4300'},
  stdio: 'inherit',
});
const frontend = spawn(process.execPath, [
  'node_modules/@angular/cli/bin/ng.js', 'serve', '--host', '127.0.0.1', ...process.argv.slice(2),
], {stdio: 'inherit'});
const children = [api, frontend];
let stopping = false;

function stop() {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill();
  }
}

for (const child of children) {
  child.on('error', error => {
    console.error('Girlyanda development server could not start:', error.message);
    process.exitCode = 1;
    stop();
  });
  child.on('exit', code => {
    if (stopping) return;
    process.exitCode = code ?? 1;
    stop();
  });
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
