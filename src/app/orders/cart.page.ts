import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { glowOptions, priceLabel, Variant, wireOptions } from '../catalog/products';
import { CartStore } from './cart.store';

@Component({
  imports: [RouterLink],
  template: `<section class="wrap page-space">
    <nav class="breadcrumbs" aria-label="Ваш шлях"><a routerLink="/">Головна</a><span aria-current="page">Кошик</span></nav>
    <h1>Кошик</h1>
    @if (cart.lines().length) {
      <div class="columns cart-layout">
        <div class="cart-lines">
          @for (line of cart.lines(); track line.sku) {
            <article class="cart-line">
              @let photo = line.variant.gallery[0];
              @if (photo && photo.kind !== 'reference') {
                <img [src]="photo.file" [alt]="photo.alt" width="100" height="100">
              } @else {
                <img [src]="'/media/' + line.product.category + '.svg'" alt="" width="100" height="100">
              }
              <div>
                <h2><a [routerLink]="['/tovar', line.product.slug]" [queryParams]="{sku: line.sku}">{{ line.product.name }}</a></h2>
                <p>{{ variantLabel(line.variant) }}</p>
                @if (line.variant.availability === 'unavailable') { <p>Немає в наявності</p> }
                <div class="variants">
                  <button type="button" class="variant-button" [attr.aria-label]="'Зменшити кількість: ' + line.product.name" [disabled]="line.quantity === 1" (click)="cart.setQuantity(line.sku, line.quantity - 1)">−</button>
                  <span>{{ line.quantity }}</span>
                  <button type="button" class="variant-button" [attr.aria-label]="'Збільшити кількість: ' + line.product.name" [disabled]="line.variant.availability === 'unavailable' || line.quantity === 99" (click)="cart.setQuantity(line.sku, line.quantity + 1)">+</button>
                  <button type="button" class="text-link" (click)="cart.setQuantity(line.sku, 0)" [attr.aria-label]="'Видалити: ' + line.product.name">Видалити</button>
                </div>
              </div>
            </article>
          }
        </div>
        <aside class="form-card">
          <h2>Підсумок</h2>
          <p>Кількість товарів: {{ cart.count() }}</p>
          <p>{{ cart.total() === null ? 'Вартість уточнюється' : priceLabel(cart.total()) }}</p>
          @if (cart.hasUnavailable()) {
            <p>Видаліть недоступні товари, щоб продовжити оформлення.</p>
          } @else {
            <a class="button primary" routerLink="/zamovlennia">Оформити замовлення</a>
          }
        </aside>
      </div>
    } @else {
      <div class="empty-state"><h2>Ваш кошик порожній</h2><a class="button primary" routerLink="/katalog">До каталогу</a></div>
    }
  </section>`,
})
export class CartPage {
  readonly cart = inject(CartStore);
  readonly priceLabel = priceLabel;

  variantLabel(variant: Variant): string {
    return [
      variant.glow && glowOptions[variant.glow].label,
      variant.wire && wireOptions[variant.wire] + ' провід',
      variant.size,
    ].filter(Boolean).join(' · ');
  }
}
