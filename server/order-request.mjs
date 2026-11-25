import { recipient, textField } from './submission-request.mjs';
import { findCatalogVariant } from '../src/app/catalog/assortment.ts';
import { priceLabel } from '../src/app/catalog/products.ts';
import { lineTotalKopiykas, orderTotalKopiykas } from '../src/app/orders/order-pricing.ts';

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

  const items = [];
  const skus = new Set();
  for (const line of lines) {
    const {sku, quantity} = line ?? {};
    if (typeof sku !== 'string' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99 || skus.has(sku)) {
      return {status: 400};
    }
    const listing = findCatalogVariant(sku);
    if (!listing || listing.variant.availability === 'unavailable') return {status: 400};
    const priceKopiykas = listing.variant.priceKopiykas;
    items.push({
      sku,
      quantity,
      name: listing.product.name,
      priceKopiykas,
      totalKopiykas: lineTotalKopiykas(priceKopiykas, quantity),
    });
    skus.add(sku);
  }

  const id = requestId.slice(0, 8).toUpperCase();
  const total = orderTotalKopiykas(items);
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
        ...items.map((item, index) => [
          `${index + 1}. ${item.name} (${item.sku})`,
          `   Кількість: ${item.quantity} шт.`,
          `   Ціна за шт.: ${priceLabel(item.priceKopiykas)}`,
          `   Сума позиції: ${item.totalKopiykas === null ? 'Уточнюється' : priceLabel(item.totalKopiykas)}`,
        ].join('\n')),
        '',
        `Разом за товари: ${total === null ? 'Вартість уточнюється' : priceLabel(total)}`,
      ].join('\n'),
      attachments: [],
    },
  };
}
