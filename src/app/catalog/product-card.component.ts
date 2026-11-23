import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Glow, glowOptions, priceLabel, Product, selectVariant } from './products';

@Component({
  selector: 'gy-product-card',
  imports: [RouterLink],
  template: `
    <article class="product-card">
      <a class="card-image" [routerLink]="['/tovar', product().slug]" [queryParams]="{sku: variant().sku}" [attr.aria-label]="product().name">
        @let image = chosen() ? variant().gallery[0] : (product().cover ?? variant().gallery[0]);
        @if (image) {
          <img [src]="image.file" [alt]="image.alt" width="627" height="627" [loading]="priority() ? 'eager' : 'lazy'" [attr.fetchpriority]="priority() ? 'high' : null" decoding="async">
          @if (image.kind === 'reference') { <span class="photo-label">Зразок макрозйомки</span> }
          @if (image.kind === 'series' && chosen()) { <span class="photo-label">Фото серії</span> }
        } @else {
          <div class="missing-photo"><img [src]="'/media/' + product().category + '.svg'" width="64" height="64" alt=""><span>Фото ще немає</span></div>
        }
      </a>
      <div class="card-body">
        <h3><a [routerLink]="['/tovar', product().slug]" [queryParams]="{sku: variant().sku}">{{ product().name }}</a></h3>
        @if (product().cardSubtitle; as subtitle) { <p class="card-subtitle">{{ subtitle }}</p> }
        <div class="card-meta">
          <span>{{ priceLabel(variant().priceKopiykas) }}</span>
          @if (glows().length > 1) { <div class="swatches" role="group" [attr.aria-label]="'Колір світіння: ' + product().name">
            @for (glow of glows(); track glow) {
              <button type="button" class="swatch" [style.--swatch]="glowOptions[glow].swatch" [attr.aria-label]="glowOptions[glow].label"
                [title]="glowOptions[glow].label" [attr.aria-pressed]="variant().glow === glow" (click)="choose(glow)"></button>
            }
          </div> }
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly priority = input(false);
  readonly initialGlow = input<Glow | undefined>();
  readonly glowOptions = glowOptions;
  readonly priceLabel = priceLabel;
  readonly glows = computed(() => [...new Set(this.product().variants.map(variant => variant.glow).filter(glow => glow !== null))]);
  readonly chosen = linkedSignal(() => this.initialGlow() !== undefined);
  readonly variant = linkedSignal(() => {
    const product = this.product();
    const glow = this.initialGlow();
    return glow ? selectVariant(product, product.variants[0], {glow}) : product.variants[0];
  });

  choose(glow: Glow): void {
    this.variant.set(selectVariant(this.product(), this.variant(), {glow}));
    this.chosen.set(true);
  }
}
