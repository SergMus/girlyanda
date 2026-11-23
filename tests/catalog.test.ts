import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { archivedIcicles, assortment } from '../src/app/catalog/assortment';
import { categories } from '../src/app/catalog/categories';
import { parseCart } from '../src/app/orders/cart.store';
import { priceLabel, selectVariant } from '../src/app/catalog/products';

const strand = assortment.find(product => product.slug === 'promin-100')!;
const retro = assortment.find(product => product.slug === 'retro-s14')!;
const icicle = assortment.find(product => product.slug === 'bakhroma-150')!;

describe('Підбір варіанта товару', () => {
  it('змінює артикул і фото без заміни чорного проводу під час вибору кольору', () => {
    const next = selectVariant(strand, strand.variants[0], {glow: 'white'});
    expect(next.sku).toBe('GY-P100-WH-BK');
    expect(next.wire).toBe('black');
    expect(next.gallery[0]?.file).toContain('promin-100-white-black.webp');
  });

  it('зберігає налаштування світіння при зміні кольору проводу', () => {
    const next = selectVariant(strand, strand.variants[0], {wire: 'white'});
    expect(next.sku).toBe('GY-P100-WW-WH');
    expect(next.gallery[0]?.file).toContain('promin-100-warm-white.webp');
  });

  it.each([
    {glow: 'red', code: 'RD'}, {glow: 'yellow', code: 'YL'}, {glow: 'blue', code: 'BL'},
  ] as const)('підбирає бахрому з кольором $glow для обох проводів', ({glow, code}) => {
    const white = selectVariant(icicle, icicle.variants[0], {glow});
    const black = selectVariant(icicle, white, {wire: 'black'});
    expect(white.sku).toBe('GY-B150-' + code + '-WH');
    expect(black.sku).toBe('GY-B150-' + code + '-BK');
    for (const item of [white, black]) {
      const file = '/media/products/bakhroma-150-' + glow + '-' + item.wire;
      expect(item.gallery[0]?.file).toBe(file + '.webp');
    }
  });

  it('повертає відсутню галерею для варіанта без підтвердженого фото', () => {
    const model = archivedIcicles.find(product => product.slug === 'kontur-114')!;
    const next = selectVariant(model, model.variants[0], {glow: 'white', wire: 'white'});
    expect(next.sku).toBe('GY-K114-WH-WH');
    expect(next.gallery).toEqual([]);
  });

  it('змінює артикул і кількість ламп при виборі довжини ретрогірлянди', () => {
    expect(retro.variants[0].lampCount).toBe(10);
    const next = selectVariant(retro, retro.variants[0], {size: '4 м'});
    expect(next.sku).toBe('GY-S14-4-WW');
    expect(next.glow).toBe('warm');
    expect(next.lampCount).toBe(20);
  });

  it('зберігає поточний артикул, якщо потрібної комбінації немає', () => {
    expect(selectVariant(retro, retro.variants[0], {wire: 'white'})).toBe(retro.variants[0]);
  });
});

describe('Стартовий асортимент', () => {
  it('показує предметні фото бахроми 150 LED для обох режимів світіння', () => {
    const flashing = assortment.find(product => product.slug === 'bakhroma-150-merekhtinnia')!;
    for (const variant of [...icicle.variants, ...flashing.variants]) {
      const photos = variant.gallery.map(photo => photo.file);
      expect(photos.length).toBeGreaterThan(0);
      expect(photos.filter(file => /-house(?:-far)?\.webp$/.test(file))).toEqual([]);
      expect(photos.filter(file => !existsSync(new URL('../public' + file, import.meta.url)))).toEqual([]);
    }
  });

  it('прив’язує моделі до категорій і використовує унікальні артикули', () => {
    const codes = assortment.flatMap(product => product.variants.map(variant => variant.sku));
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(assortment.map(product => product.category))).toEqual(new Set(categories.map(category => category.id)));
    for (const product of assortment) {
      const category = categories.find(item => item.id === product.category);
      expect(product.subcategories.every(child => category?.children.some(option => option.id === child))).toBe(true);
    }
  });

  it('не трактує невідому ціну як нульову', () => {
    expect(priceLabel(null)).toBe('Ціна уточнюється');
  });

  it('має локальні файли галереї для всіх 20 варіантів вуличної нитки', () => {
    const outdoorStrands = assortment.filter(product => product.category === 'nytka' && product.subcategories.includes('vulychni'));
    const galleries = outdoorStrands.flatMap(product => product.variants.map(variant => variant.gallery));
    expect(galleries).toHaveLength(20);
    expect(galleries.filter(gallery => gallery.length === 0)).toEqual([]);
    const paths = new Set(galleries.flatMap(gallery => gallery.map(photo => photo.file)));
    expect([...paths].filter(path => !existsSync(new URL('../public' + path, import.meta.url)))).toEqual([]);
  });

  it.each([
    {leds: 456, size: '2 × 1,5 м'},
    {leds: 912, size: '2 × 3 м'},
    {leds: 288, size: '1,5 × 1 м'},
  ])('показує окремі фото для всіх кольорів та проводів штори $leds LED', ({leds, size}) => {
    const curtain = assortment.find(product => product.slug === 'zavisa-' + leds)!;
    expect(curtain.specifications).toContainEqual({label: 'Крок між вертикальними нитками', value: '8 см'});
    expect(curtain.variants.slice(0, 4).map(variant => variant.sku)).toEqual([
      `GY-Z${leds}-WW-WH`, `GY-Z${leds}-CW-WH`, `GY-Z${leds}-WW-BK`, `GY-Z${leds}-CW-BK`,
    ]);
    const galleriesByWire = ['white', 'black'].map(wire => {
      const variants = curtain.variants.filter(variant => variant.wire === wire);
      expect(variants.map(variant => variant.glow)).toEqual(['warm', 'cool', 'yellow', 'green', 'red', 'blue']);
      expect(variants.every(variant => variant.size === size && variant.gallery.length > 0)).toBe(true);
      return new Set(variants.flatMap(variant => variant.gallery.map(photo => photo.file)));
    });
    const [whitePhotos, blackPhotos] = galleriesByWire;
    expect([...whitePhotos].filter(path => blackPhotos.has(path))).toEqual([]);
    const mainPhotos = curtain.variants.map(variant => variant.gallery[0]);
    expect(mainPhotos.every(photo => photo?.kind === 'variant')).toBe(true);
    expect(new Set(mainPhotos.map(photo => photo?.file)).size).toBe(12);
    const paths = new Set([...whitePhotos, ...blackPhotos]);
    expect([...paths].filter(path => !existsSync(new URL('../public' + path, import.meta.url)))).toEqual([]);
  });
});

describe('Відновлення кошика', () => {
  it('об’єднує дублікати за артикулом і відхиляє пошкоджені записи', () => {
    expect(parseCart('[{"sku":"A","quantity":3},{"sku":"A","quantity":97},{"sku":"B","quantity":0},null]'))
      .toEqual([{sku: 'A', quantity: 99}]);
  });

  it('відновлює попередній артикул під новим кодом і зберігає кількість', () => {
    const saved = '[{"sku":"LEDPLR-100-BKWW-EXTRA","quantity":2},{"sku":"GY-P100-WW-BK","quantity":1}]';
    expect(parseCart(saved)).toEqual([{sku: 'GY-P100-WW-BK', quantity: 3}]);
  });

  it('повертає порожній кошик, якщо запис неможливо прочитати', () => {
    expect(parseCart('invalid')).toEqual([]);
  });
});
