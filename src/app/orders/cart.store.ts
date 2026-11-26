import { afterNextRender, computed, inject, Injectable, signal } from '@angular/core';
import { CatalogRepository } from '../catalog/catalog.repository';
import { CART_STORAGE_KEY, MAX_CART_QUANTITY, type CartItem } from './cart-data';
import { updateCartItemQuantity } from './cart-items';
import { parseCart } from './cart-storage';
import { lineTotalKopiykas, orderTotalKopiykas } from './order-pricing';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly catalog = inject(CatalogRepository);

  private storage: Storage | null = null;

  private readonly items = signal<CartItem[]>([]);

  readonly lines = computed(() =>
    this.items().flatMap(item => {
      const listing = this.catalog.findVariant(item.sku);

      return listing
        ? [
            {
              ...item,
              ...listing,
              totalKopiykas: lineTotalKopiykas(listing.variant.priceKopiykas, item.quantity),
            },
          ]
        : [];
    }),
  );
  readonly count = computed(() => this.lines().reduce((count, line) => count + line.quantity, 0));
  readonly hasUnavailable = computed(() => this.lines().some(line => line.variant.availability === 'unavailable'));
  readonly total = computed(() => orderTotalKopiykas(this.lines()));

  constructor() {
    afterNextRender(() => {
      try {
        this.storage = localStorage;
        this.items.set(parseCart(this.storage.getItem(CART_STORAGE_KEY)));
      } catch {
        // Storage can be blocked by the browser.
      }
    });
  }

  add(sku: string): boolean {
    const listing = this.catalog.findVariant(sku);

    if (!listing || listing.variant.availability === 'unavailable') {
      return false;
    }

    const quantity = this.items().find(item => item.sku === sku)?.quantity ?? 0;

    if (quantity >= MAX_CART_QUANTITY) {
      return false;
    }

    this.setQuantity(sku, quantity + 1);

    return true;
  }

  setQuantity(sku: string, quantity: number): void {
    const listing = this.catalog.findVariant(sku);

    if (!Number.isInteger(quantity) || !listing) {
      return;
    }

    const items = this.items();
    const nextQuantity = Math.max(0, Math.min(MAX_CART_QUANTITY, quantity));
    const currentQuantity = items.find(item => item.sku === sku)?.quantity ?? 0;

    if (listing.variant.availability === 'unavailable' && nextQuantity > currentQuantity) {
      return;
    }

    this.save(updateCartItemQuantity(items, sku, nextQuantity));
  }

  private save(items: CartItem[]): void {
    this.items.set(items);

    try {
      this.storage?.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart remains usable for the current session when storage is disabled.
    }
  }
}
