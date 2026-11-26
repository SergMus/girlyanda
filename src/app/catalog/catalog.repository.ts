import { Injectable, signal } from '@angular/core';
import { ARCHIVED_ICICLES, ASSORTMENT, findCatalogVariant, LEGACY_SNOWFLAKE } from './assortment';

@Injectable({ providedIn: 'root' })
export class CatalogRepository {
  private readonly collection = signal(ASSORTMENT);

  readonly products = this.collection.asReadonly();

  findProduct(slug: string) {
    if (slug === LEGACY_SNOWFLAKE.slug) {
      return LEGACY_SNOWFLAKE;
    }

    return (
      this.products().find(product => product.slug === slug) ?? ARCHIVED_ICICLES.find(product => product.slug === slug)
    );
  }

  findVariant(sku: string) {
    return findCatalogVariant(sku, this.products());
  }
}
