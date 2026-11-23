import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `<section class="wrap page-space"><h1>Сторінку не знайдено</h1>
    <a class="button primary" routerLink="/">На головну</a></section>`,
})
export class NotFoundPage {}
