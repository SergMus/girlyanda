import { recipient, textField } from './submission-request.mjs';

export const orderSubmission = {
  name: 'Order',
  uploadLimit: 64 * 1024,
  createMessage: orderMessage,
};

function orderMessage(data) {
  const requestId = textField(data, 'requestId', 36);
  const name = textField(data, 'name', 80);
  const phone = textField(data, 'phone', 25);
  const city = textField(data, 'city', 100);
  const delivery = textField(data, 'delivery', 180);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(requestId) ||
      [name, phone, city, delivery].some(value => !value || /[\x00-\x1f\x7f]/.test(value)) ||
      phone.replace(/\D/g, '').length < 7) {
    return {status: 400};
  }

  let lines;
  try {
    lines = JSON.parse(textField(data, 'lines', orderSubmission.uploadLimit));
  } catch {
    return {status: 400};
  }
  if (!Array.isArray(lines) || !lines.length) return {status: 400};

  const items = new Map();
  for (const line of lines) {
    const {sku, quantity} = line ?? {};
    if (typeof sku !== 'string' || sku.length > 64 || !/^GY-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(sku) ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > 99 || items.has(sku)) {
      return {status: 400};
    }
    items.set(sku, quantity);
  }

  const id = requestId.slice(0, 8).toUpperCase();
  return {
    id,
    idempotencyKey: 'order/' + requestId,
    message: {
      to: recipient,
      subject: 'Girlyanda · Замовлення ' + id,
      text: [
        'Замовлення ' + id,
        'Ім’я: ' + name,
        'Телефон: ' + phone,
        'Місто: ' + city,
        'Відділення або адреса: ' + delivery,
        '',
        'Товари:',
        ...Array.from(items, ([sku, quantity]) => sku + ' × ' + quantity),
      ].join('\n'),
      attachments: [],
    },
  };
}
