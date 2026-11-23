import { afterNextRender, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CartStore } from '../orders/cart.store';
import { CatalogRepository } from './catalog.repository';
import { categories } from './categories';
import { availabilityLabels, glowOptions, priceLabel, selectVariant, Variant, wireOptions } from './products';

@Component({
  imports: [RouterLink],
  templateUrl: './product.page.html',
  styleUrl: './product.page.scss',
})
export class ProductPage {
  readonly slug = input.required<string>();
  readonly sku = input<string>();
  private readonly queryReady = signal(false);
  private readonly repo = inject(CatalogRepository);
  private readonly cart = inject(CartStore);
  readonly product = computed(() => this.repo.findProduct(this.slug()));
  readonly category = computed(() => categories.find(category => category.id === this.product()?.category));
  readonly variant = linkedSignal(() => {
    const product = this.product();
    const sku = this.queryReady() ? this.sku() : undefined;
    return product?.variants.find(item => item.sku === sku) ?? product?.variants[0];
  });
  readonly picture = linkedSignal(() => this.variant()?.gallery[0]);
  readonly variantOptions = computed(() => {
    const variants = this.product()?.variants ?? [];
    return {
      glows: [...new Set(variants.map(item => item.glow).filter(glow => glow !== null))],
      wires: [...new Set(variants.map(item => item.wire).filter(wire => wire !== null))],
      sizes: [...new Set(variants.map(item => item.size).filter(size => size !== null))],
    };
  });
  readonly priceLabel = priceLabel;
  readonly wireOptions = wireOptions;
  readonly glowOptions = glowOptions;
  readonly availabilityLabels = availabilityLabels;
  readonly status = signal('');

  constructor() {
    afterNextRender(() => this.queryReady.set(true));
    const title = inject(Title);
    const meta = inject(Meta);
    effect(() => {
      title.setTitle((this.product()?.name ?? 'Товар не знайдено') + ' | Girlyanda');
      const product = this.product();
      if (product) meta.updateTag({name: 'description', content: product.description});
    });
  }

  choose(change: Partial<Pick<Variant, 'glow' | 'size' | 'wire'>>): void {
    const product = this.product();
    const current = this.variant();
    if (!product || !current) return;
    this.variant.set(selectVariant(product, current, change));
    this.status.set('');
  }

  add(variant: Variant): void {
    this.status.set(this.cart.add(variant.sku) ? 'Варіант додано до кошика.' : 'Не вдалося додати варіант до кошика.');
  }
}
