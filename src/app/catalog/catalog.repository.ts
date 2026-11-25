import { Injectable, signal } from '@angular/core';
import { archivedIcicles, assortment, findCatalogVariant, legacySnowflake } from './assortment';

@Injectable({providedIn: 'root'})
export class CatalogRepository {
  private readonly collection = signal(assortment);
  readonly products = this.collection.asReadonly();

  findProduct(slug: string) {
    if (slug === legacySnowflake.slug) return legacySnowflake;
    return this.products().find(product => product.slug === slug) ?? archivedIcicles.find(product => product.slug === slug);
  }

  findVariant(sku: string) {
    return findCatalogVariant(sku, this.products());
  }
}
