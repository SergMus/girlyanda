import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Glow, GLOW_OPTIONS, priceLabel, Product, selectVariant } from '../products';

@Component({
  selector: 'gy-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly priority = input(false);
  readonly initialGlow = input<Glow | undefined>();
  readonly glowOptions = GLOW_OPTIONS;
  readonly priceLabel = priceLabel;
  readonly glows = computed(() => [
    ...new Set(
      this.product()
        .variants.map(variant => variant.glow)
        .filter(glow => glow !== null),
    ),
  ]);
  readonly chosen = linkedSignal(() => this.initialGlow() !== undefined);
  readonly variant = linkedSignal(() => {
    const product = this.product();
    const glow = this.initialGlow();

    return glow ? selectVariant(product, product.variants[0], { glow }) : product.variants[0];
  });

  choose(glow: Glow): void {
    this.variant.set(selectVariant(this.product(), this.variant(), { glow }));
    this.chosen.set(true);
  }
}
