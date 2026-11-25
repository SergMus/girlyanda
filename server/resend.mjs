export async function sendResendEmail(apiKey, from, {to, subject, text, attachments}, idempotencyKey) {
  const fields = JSON.stringify({from: 'Girlyanda <' + from + '>', to: [to], subject, text});
  // Keep the base64 attachment out of JSON.stringify to avoid scanning the entire photo again.
  const body = new Blob([
    fields.slice(0, -1),
    ',"attachments":[',
    ...attachments.flatMap(({filename, content}, index) => [
      index === 0 ? '' : ',',
      '{"filename":',
      JSON.stringify(filename),
      ',"content":"',
      content.toString('base64'),
      '"}',
    ]),
    ']}',
  ]);
  const headers = {Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json'};
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw Object.assign(new Error('Resend rejected the email'), {code: 'RESEND_HTTP_' + response.status});
  }
  const {id} = await response.json();
  if (typeof id !== 'string' || !id) throw new Error('Resend did not return an email ID');
}
