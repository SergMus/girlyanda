import type { CartItem } from './cart-data';

export function updateCartItemQuantity(items: CartItem[], sku: string, quantity: number): CartItem[] {
  const hasItem = items.some(item => item.sku === sku);

  if (quantity === 0) {
    return hasItem ? items.filter(item => item.sku !== sku) : items;
  }

  if (hasItem) {
    return items.map(item => (item.sku === sku ? { sku, quantity } : item));
  }

  return [...items, { sku, quantity }];
}
