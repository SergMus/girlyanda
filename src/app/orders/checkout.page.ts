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
      <div class="empty-state" role="status"><h2>Замовлення {{ receipt() }} збережено</h2><p>Дані залишилися в цьому браузері.</p><a class="button primary" routerLink="/katalog">Повернутися до каталогу</a></div>
    } @else if (cart.hasUnavailable()) {
      <div class="empty-state"><h2>У кошику є недоступні товари</h2><a class="button primary" routerLink="/koshyk">Повернутися до кошика</a></div>
    } @else if (cart.lines().length) {
      <div class="columns">
        <div>
          <h2>Дані для доставки</h2>
          <p class="notice">Замовлення зберігається лише в цьому браузері. Оплата й доставка наразі недоступні.</p>
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
          <button class="button primary" type="submit" [disabled]="busy()">{{ busy() ? 'Збереження…' : 'Зберегти замовлення' }}</button>
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
    this.busy.set(true);
    try {
      this.receipt.set(await this.gateway.sendOrder({name, phone, city, delivery, lines}));
      for (const line of lines) {
        const quantity = this.cart.lines().find(item => item.sku === line.sku)?.quantity ?? 0;
        this.cart.setQuantity(line.sku, quantity - line.quantity);
      }
    } catch {
      this.error.set('Зберегти замовлення не вдалося. Спробуйте ще раз.');
    } finally {
      this.busy.set(false);
    }
  }
}
