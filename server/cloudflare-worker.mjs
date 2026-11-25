import { installationSubmission } from './installation-request.mjs';
import { orderSubmission } from './order-request.mjs';
import { sendResendEmail } from './resend.mjs';

const noStore = {'Cache-Control': 'no-store'};
const submissions = new Map([
  ['/api/installation', installationSubmission],
  ['/api/orders', orderSubmission],
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');
    const submission = submissions.get(path);
    if (submission) {
      if (request.method !== 'POST') return new Response(null, {status: 405, headers: {...noStore, Allow: 'POST'}});
      return handleSubmission(request, env, path, submission);
    }

    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return errorResponse(404);

    const acceptsHtml = request.headers.get('Accept')?.includes('text/html');
    if ((request.method === 'GET' || request.method === 'HEAD') && acceptsHtml) {
      return env.ASSETS.fetch(new Request(new URL('/index.csr.html', url), {method: request.method}));
    }
    return errorResponse(404);
  },
};

async function handleSubmission(request, env, path, {createMessage, uploadLimit, name}) {
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return errorResponse(403);
  const apiKey = env.GIRLYANDA_RESEND_API_KEY?.trim();
  const from = env.GIRLYANDA_RESEND_FROM?.trim();
  if (!apiKey || !from) return errorResponse(503);

  const contentType = request.headers.get('Content-Type') ?? '';
  const encoding = request.headers.get('Content-Encoding')?.toLowerCase() ?? 'identity';
  if (!/^multipart\/form-data(?:\s*;|$)/i.test(contentType) || encoding !== 'identity') return errorResponse(415);
  if (Number(request.headers.get('Content-Length')) > uploadLimit) return errorResponse(413);

  const client = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const {success} = await env.INSTALLATION_LIMIT.limit({key: path + ':' + client});
  if (!success) return new Response(null, {status: 429, headers: {...noStore, 'Retry-After': '60'}});

  let bytesRead = 0;
  let data;
  try {
    const body = request.body?.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        bytesRead += chunk.byteLength;
        if (bytesRead > uploadLimit) return controller.error(new RangeError('Upload too large'));
        controller.enqueue(chunk);
      },
    }));
    data = await new Response(body, {headers: {'Content-Type': contentType}}).formData();
  } catch {
    return errorResponse(bytesRead > uploadLimit ? 413 : 400);
  }

  const result = await createMessage(data);
  if ('status' in result) return errorResponse(result.status);
  try {
    await sendResendEmail(apiKey, from, result.message, result.idempotencyKey);
  } catch (error) {
    console.error(name + ' mail failed', error?.code ?? 'MAIL_ERROR');
    return errorResponse(502);
  }
  return Response.json({id: result.id}, {status: 201, headers: noStore});
}

function errorResponse(status) {
  return new Response(null, {status, headers: noStore});
}
