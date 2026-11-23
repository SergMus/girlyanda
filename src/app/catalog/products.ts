export const glowOptions = {
  warm: {label: 'Теплий білий', swatch: '#dfab5a'},
  cool: {label: 'Холодний білий', swatch: '#e5edf0'},
  white: {label: 'Білий', swatch: '#f4f2df'},
  orange: {label: 'Помаранчевий', swatch: '#e88531'},
  red: {label: 'Червоний', swatch: '#d74645'},
  yellow: {label: 'Жовтий', swatch: '#ebcc48'},
  blue: {label: 'Синій', swatch: '#4f78d0'},
  green: {label: 'Зелений', swatch: '#4d9b64'},
  rgb: {label: 'Різнокольоровий (RGB)', swatch: 'conic-gradient(#d98266, #dfb549, #67a08b, #6e80cf, #d98266)'},
} as const;

export const wireOptions = {white: 'Білий', black: 'Чорний'} as const;
export type Glow = keyof typeof glowOptions;
export type Wire = keyof typeof wireOptions;
export type Availability = 'available' | 'unavailable' | 'unknown';

export interface ProductMedia {
  readonly file: string;
  readonly alt: string;
  readonly kind: 'variant' | 'series' | 'reference' | 'application';
  readonly note?: string;
}

export interface Variant {
  readonly sku: string;
  readonly glow: Glow | null;
  readonly wire: Wire | null;
  readonly size: string | null;
  readonly lampCount?: number;
  readonly priceKopiykas: number | null;
  readonly availability: Availability;
  readonly gallery: readonly ProductMedia[];
}

export interface Product {
  readonly slug: string;
  readonly name: string;
  readonly cardSubtitle?: string;
  readonly category: string;
  readonly subcategories: readonly string[];
  readonly description: string;
  readonly cover?: ProductMedia;
  readonly specifications?: readonly {readonly label: string; readonly value: string}[];
  readonly featured: boolean;
  readonly variants: readonly [Variant, ...Variant[]];
}

export function selectVariant(product: Product, current: Variant, change: Partial<Pick<Variant, 'glow' | 'wire' | 'size'>>): Variant {
  const compatible = product.variants.filter(variant =>
    Object.entries(change).every(([key, value]) => variant[key as keyof typeof change] === value));
  const preference = (variant: Variant) =>
    Number(variant.glow === current.glow) * 4 +
    Number(variant.wire === current.wire) * 2 +
    Number(variant.size === current.size);
  return compatible.reduce<Variant | undefined>((best, variant) =>
    !best || preference(variant) > preference(best) ? variant : best, undefined) ?? current;
}

export function priceLabel(value: number | null): string {
  return value === null ? 'Ціна уточнюється' : new Intl.NumberFormat('uk-UA', {
    style: 'currency', currency: 'UAH',
  }).format(value / 100);
}

export const availabilityLabels: Record<Availability, string> = {
  available: 'У наявності',
  unavailable: 'Немає в наявності',
  unknown: 'Наявність уточнюється',
};
