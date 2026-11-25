import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { priceLabel, variantLabel } from '../catalog/products';
import { IconComponent } from '../shared/icons.component';
import { CartStore } from './cart.store';

@Component({
  imports: [RouterLink, IconComponent],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage {
  readonly cart = inject(CartStore);
  readonly priceLabel = priceLabel;
  readonly variantLabel = variantLabel;
}
