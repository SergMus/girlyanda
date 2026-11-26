import { RECIPIENT, textField } from './submission-request.mjs';
import { findCatalogVariant } from '../src/app/catalog/assortment.ts';
import { priceLabel } from '../src/app/catalog/products.ts';
import { lineTotalKopiykas, orderTotalKopiykas } from '../src/app/orders/order-pricing.ts';
import { hasMinimumPhoneDigits } from '../src/app/shared/phone-number.ts';

export const ORDER_SUBMISSION = {
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

  const validRequestId = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(requestId);

  const hasInvalidCustomerDetails = [name, phone, city, delivery].some(
    // eslint-disable-next-line no-control-regex -- Reject control characters in customer details.
    value => !value || /[\x00-\x1f\x7f]/.test(value),
  );

  if (!validRequestId || hasInvalidCustomerDetails || !hasMinimumPhoneDigits(phone)) {
    return { status: 400 };
  }

  let lines;

  try {
    lines = JSON.parse(textField(data, 'lines', ORDER_SUBMISSION.uploadLimit));
  } catch {
    return { status: 400 };
  }

  if (!Array.isArray(lines) || !lines.length) {
    return { status: 400 };
  }

  const items = [];
  const skus = new Set();
  for (const line of lines) {
    const { sku, quantity } = line ?? {};
    const hasUniqueSku = typeof sku === 'string' && !skus.has(sku);
    const hasValidQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;

    if (!hasUniqueSku || !hasValidQuantity) {
      return { status: 400 };
    }

    const listing = findCatalogVariant(sku);

    if (!listing || listing.variant.availability === 'unavailable') {
      return { status: 400 };
    }

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
      to: RECIPIENT,
      subject: 'Girlyanda · Замовлення ' + id,
      text: [
        'Замовлення ' + id,
        'Ім’я: ' + name,
        'Телефон: ' + phone,
        'Місто: ' + city,
        'Відділення або адреса: ' + delivery,
        '',
        'Товари:',
        ...items.map((item, index) =>
          [
            `${index + 1}. ${item.name} (${item.sku})`,
            `   Кількість: ${item.quantity} шт.`,
            `   Ціна за шт.: ${priceLabel(item.priceKopiykas)}`,
            `   Сума позиції: ${item.totalKopiykas === null ? 'Уточнюється' : priceLabel(item.totalKopiykas)}`,
          ].join('\n'),
        ),
        '',
        `Разом за товари: ${total === null ? 'Вартість уточнюється' : priceLabel(total)}`,
      ].join('\n'),
      attachments: [],
    },
  };
}
