import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from './cart.store';
import { field, SubmissionGateway } from './submission.gateway';

@Component({
  imports: [RouterLink],
  template: `<section class="wrap page-space">
    <nav class="breadcrumbs" aria-label="Ваш шлях"><a routerLink="/">Головна</a><a routerLink="/koshyk">Кошик</a><span aria-current="page">Оформлення</span></nav>
    <h1>Оформлення замовлення</h1>
    @if (receipt()) {
      <div class="empty-state" role="status"><h2>Замовлення {{ receipt() }} надіслано</h2><p>Ми зв’яжемося з вами, щоб підтвердити наявність і узгодити оплату та доставку.</p><a class="button primary" routerLink="/katalog">Повернутися до каталогу</a></div>
    } @else if (cart.hasUnavailable()) {
      <div class="empty-state"><h2>У кошику є недоступні товари</h2><a class="button primary" routerLink="/koshyk">Повернутися до кошика</a></div>
    } @else if (cart.lines().length) {
      <div class="columns">
        <div>
          <h2>Дані для доставки</h2>
          <ul class="order-list">
            @for (line of cart.lines(); track line.sku) { <li>{{ line.product.name }} · {{ line.sku }} × {{ line.quantity }}</li> }
          </ul>
        </div>
        <form class="form-card" (submit)="submit($event)">
          <div class="form-grid">
            <label>Ім’я <input name="name" required autocomplete="name" maxlength="80"></label>
            <label>Телефон <input name="phone" required type="tel" autocomplete="tel" minlength="7" maxlength="25"></label>
          </div>
          <label>Місто <input name="city" required autocomplete="address-level2" maxlength="100"></label>
          <label>Відділення або адреса <input name="delivery" required autocomplete="street-address" maxlength="180"></label>
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
          <button class="button primary" type="submit" [disabled]="busy()">{{ busy() ? 'Надсилання…' : 'Надіслати замовлення' }}</button>
        </form>
      </div>
    } @else {
      <div class="empty-state"><h2>Ваш кошик порожній</h2><a class="button primary" routerLink="/katalog">До каталогу</a></div>
    }
  </section>`,
})
export class CheckoutPage {
  readonly cart = inject(CartStore);
  private readonly gateway = inject(SubmissionGateway);
  private pendingOrder?: {payload: string; requestId: string};
  readonly busy = signal(false);
  readonly receipt = signal('');
  readonly error = signal('');

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.busy() || !this.cart.lines().length || this.cart.hasUnavailable()) return;
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const name = field(data, 'name');
    const phone = field(data, 'phone');
    const city = field(data, 'city');
    const delivery = field(data, 'delivery');
    this.error.set('');
    if (!name || phone.replace(/\D/g, '').length < 7 || !city || !delivery) {
      this.error.set('Заповніть обов’язкові поля та перевірте номер телефону.');
      return;
    }
    const lines = this.cart.lines().map(({sku, quantity}) => ({sku, quantity}));
    const order = {name, phone, city, delivery, lines};
    const payload = JSON.stringify(order);
    this.busy.set(true);
    try {
      if (this.pendingOrder?.payload !== payload) this.pendingOrder = {payload, requestId: crypto.randomUUID()};
      this.receipt.set(await this.gateway.sendOrder(order, this.pendingOrder.requestId));
      this.pendingOrder = undefined;
      for (const line of lines) {
        const quantity = this.cart.lines().find(item => item.sku === line.sku)?.quantity ?? 0;
        this.cart.setQuantity(line.sku, quantity - line.quantity);
      }
    } catch {
      this.error.set('Надіслати замовлення не вдалося. Спробуйте ще раз.');
    } finally {
      this.busy.set(false);
    }
  }
}
