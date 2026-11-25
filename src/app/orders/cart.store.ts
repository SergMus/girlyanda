import { afterNextRender, computed, inject, Injectable, signal } from '@angular/core';
import { CatalogRepository } from '../catalog/catalog.repository';
import { lineTotalKopiykas, orderTotalKopiykas } from './order-pricing';

export interface CartItem {
  readonly sku: string;
  readonly quantity: number;
}

const key = 'girlyanda.cart.v1';
const maxQuantity = 99;

// Translate carts saved before the storefront adopted its own article numbers.
const previousSkus = new Map<string, string>([
  ['LU-IC90-WW-BK', 'GY-K090-WW-BK'],
  ['LU-IC90-CW-BK', 'GY-K090-CW-BK'],
  ['LU-IC90-WW-WH', 'GY-K090-WW-WH'],
  ['LU-IC90-CW-WH', 'GY-K090-CW-WH'],
  ['LU-C456-WW-WH', 'GY-Z456-WW-WH'],
  ['LU-C456-CW-WH', 'GY-Z456-CW-WH'],
  ['LU-C456-WW-BK', 'GY-Z456-WW-BK'],
  ['LU-C456-CW-BK', 'GY-Z456-CW-BK'],
  ['LEDNLR-288', 'GY-NET288-WH'],
  ['LU-GAL20-WW', 'GY-S020-WW'],
  ['LU-GAL20-CW', 'GY-S020-CW'],
  ['LU-SNOW-F40-CW', 'GY-SNOW40-CW'],
  ['LU-SNOW-F60-CW', 'GY-SNOW60-CW'],
  ['LU-S14-WW-2', 'GY-S14-2-WW'],
  ['LU-S14-WW-4', 'GY-S14-4-WW'],
  ['LU-MAGIC-SPIRAL-4FT', 'GY-SPIRAL120-RGB'],
  ['PW-Cord-BK', 'GY-P3A-BK'],
  ['PW-Cord-WH', 'GY-P3A-WH'],
  ['LEDICLR-114-BKWW-EXTRA', 'GY-K114-WW-BK'],
  ['LEDICLR-114-BKWH-EXTRA', 'GY-K114-WH-BK'],
  ['LEDICLR-114-WHWW-EXTRA', 'GY-K114-WW-WH'],
  ['LEDICLR-114-WHWH-EXTRA', 'GY-K114-WH-WH'],
  ['LEDPLR-100-BKWW-EXTRA', 'GY-P100-WW-BK'],
  ['LEDPLR-100-BKWH-EXTRA', 'GY-P100-WH-BK'],
  ['LEDPLR-100-WHWW-EXTRA', 'GY-P100-WW-WH'],
  ['LEDPLR-100-WHWH-EXTRA', 'GY-P100-WH-WH'],
]);


export function parseCart(value: string | null): CartItem[] {
  try {
    const entries: unknown = JSON.parse(value ?? '[]');
    if (!Array.isArray(entries)) return [];
    const unique = new Map<string, number>();
    for (const item of entries) {
      if (typeof item?.sku === 'string' && Number.isInteger(item.quantity) && item.quantity > 0) {
        const sku = previousSkus.get(item.sku) ?? item.sku;
        unique.set(sku, Math.min(maxQuantity, (unique.get(sku) ?? 0) + item.quantity));
      }
    }
    return Array.from(unique, ([sku, quantity]) => ({sku, quantity}));
  } catch {
    return [];
  }
}

@Injectable({providedIn: 'root'})
export class CartStore {
  private readonly catalog = inject(CatalogRepository);
  private storage: Storage | null = null;
  private readonly items = signal<CartItem[]>([]);
  readonly lines = computed(() => this.items().flatMap(item => {
    const listing = this.catalog.findVariant(item.sku);
    return listing ? [{
      ...item,
      ...listing,
      totalKopiykas: lineTotalKopiykas(listing.variant.priceKopiykas, item.quantity),
    }] : [];
  }));
  readonly count = computed(() => this.lines().reduce((count, line) => count + line.quantity, 0));
  readonly hasUnavailable = computed(() => this.lines().some(line => line.variant.availability === 'unavailable'));
  readonly total = computed(() => orderTotalKopiykas(this.lines()));

  constructor() {
    afterNextRender(() => {
      try {
        this.storage = localStorage;
        this.items.set(parseCart(this.storage.getItem(key)));
      } catch {
        // Storage can be blocked by the browser.
      }
    });
  }

  add(sku: string): boolean {
    const listing = this.catalog.findVariant(sku);
    if (!listing || listing.variant.availability === 'unavailable') return false;
    const quantity = this.items().find(item => item.sku === sku)?.quantity ?? 0;
    if (quantity >= maxQuantity) return false;
    this.setQuantity(sku, quantity + 1);
    return true;
  }

  setQuantity(sku: string, quantity: number): void {
    const listing = this.catalog.findVariant(sku);
    if (!Number.isInteger(quantity) || !listing) return;
    const items = this.items();
    const value = Math.max(0, Math.min(maxQuantity, quantity));
    const current = items.find(item => item.sku === sku)?.quantity ?? 0;
    if (listing.variant.availability === 'unavailable' && value > current) return;
    this.save(items.some(item => item.sku === sku)
      ? items.flatMap(item => item.sku !== sku ? [item] : value ? [{sku, quantity: value}] : [])
      : value ? [...items, {sku, quantity: value}] : items);
  }

  private save(items: CartItem[]): void {
    this.items.set(items);
    try {
      this.storage?.setItem(key, JSON.stringify(items));
    } catch {
      // The cart remains usable for the current session when storage is disabled.
    }
  }
}
