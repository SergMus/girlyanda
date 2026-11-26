import { LEGACY_CART_SKUS, MAX_CART_QUANTITY, type CartItem } from './cart-data';

export function parseCart(value: string | null): CartItem[] {
  try {
    const entries: unknown = JSON.parse(value ?? '[]');

    if (!Array.isArray(entries)) {
      return [];
    }

    const unique = new Map<string, number>();
    for (const item of entries) {
      if (typeof item?.sku === 'string' && Number.isInteger(item.quantity) && item.quantity > 0) {
        const sku = LEGACY_CART_SKUS.get(item.sku) ?? item.sku;
        unique.set(sku, Math.min(MAX_CART_QUANTITY, (unique.get(sku) ?? 0) + item.quantity));
      }
    }

    return Array.from(unique, ([sku, quantity]) => ({ sku, quantity }));
  } catch {
    return [];
  }
}
