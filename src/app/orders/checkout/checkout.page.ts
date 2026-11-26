import { afterNextRender, Component, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { priceLabel, variantLabel } from '../../catalog/products';
import { field } from '../../shared/form-data';
import { hasMinimumPhoneDigits } from '../../shared/phone-number';
import { CartStore } from '../cart.store';
import { SubmissionGateway } from '../submission.gateway';

@Component({
  imports: [RouterLink],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
})
export class CheckoutPage {
  private readonly receiptHeading = viewChild<ElementRef<HTMLHeadingElement>>('receiptHeading');

  readonly cart = inject(CartStore);

  private readonly gateway = inject(SubmissionGateway);
  private readonly injector = inject(Injector);

  private pendingOrder?: { payload: string; requestId: string };

  readonly busy = signal(false);
  readonly receipt = signal('');
  readonly error = signal('');
  readonly priceLabel = priceLabel;
  readonly variantLabel = variantLabel;

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (this.busy() || !this.cart.lines().length || this.cart.hasUnavailable()) {
      return;
    }

    const data = new FormData(event.currentTarget as HTMLFormElement);
    const name = field(data, 'name');
    const phone = field(data, 'phone');
    const city = field(data, 'city');
    const delivery = field(data, 'delivery');
    this.error.set('');

    const hasDeliveryDetails = Boolean(name && city && delivery);

    if (!hasDeliveryDetails || !hasMinimumPhoneDigits(phone)) {
      this.error.set('Заповніть обов’язкові поля та перевірте номер телефону.');

      return;
    }

    const lines = this.cart.lines().map(({ sku, quantity }) => ({ sku, quantity }));
    const order = { name, phone, city, delivery, lines };
    const payload = JSON.stringify(order);
    this.busy.set(true);

    try {
      if (this.pendingOrder?.payload !== payload) {
        this.pendingOrder = { payload, requestId: crypto.randomUUID() };
      }

      this.receipt.set(await this.gateway.sendOrder(order, this.pendingOrder.requestId));
      this.pendingOrder = undefined;
      for (const line of lines) {
        const quantity = this.cart.lines().find(item => item.sku === line.sku)?.quantity ?? 0;
        this.cart.setQuantity(line.sku, quantity - line.quantity);
      }
      afterNextRender({ write: () => this.receiptHeading()?.nativeElement.focus() }, { injector: this.injector });
    } catch {
      this.error.set('Надіслати замовлення не вдалося. Спробуйте ще раз.');
    } finally {
      this.busy.set(false);
    }
  }
}
