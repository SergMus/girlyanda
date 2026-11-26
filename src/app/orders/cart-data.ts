export interface CartItem {
  readonly sku: string;
  readonly quantity: number;
}

export const CART_STORAGE_KEY = 'girlyanda.cart.v1';
export const MAX_CART_QUANTITY = 99;

// Translate carts saved before the storefront adopted its own article numbers.
export const LEGACY_CART_SKUS: ReadonlyMap<string, string> = new Map([
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
