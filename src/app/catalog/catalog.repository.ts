import { Injectable, signal } from '@angular/core';
import { archivedIcicles, assortment, legacySnowflake } from './assortment';
import { Variant } from './products';

@Injectable({providedIn: 'root'})
export class CatalogRepository {
  private readonly collection = signal(assortment);
  readonly products = this.collection.asReadonly();

  findProduct(slug: string) {
    if (slug === legacySnowflake.slug) return legacySnowflake;
    return this.products().find(product => product.slug === slug) ?? archivedIcicles.find(product => product.slug === slug);
  }

  findVariant(sku: string) {
    for (const product of [...this.products(), ...archivedIcicles]) {
      const variant: Variant | undefined = product.variants.find(item => item.sku === sku);
      if (variant) return {product, variant};
    }
    return undefined;
  }
}
