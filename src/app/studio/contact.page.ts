import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icons.component';

const phone = '+380503555556';

@Component({
  imports: [RouterLink, IconComponent],
  styles: [`
    h1 {
      margin-bottom: clamp(1.35rem, 3.3vw, 2.5rem);
      font-size: clamp(2.15rem, 5.2vw, 4.5rem);
    }
    .channels {
      display: grid;
      gap: clamp(1.1rem, 3vw, 2rem);
    }
    .contact-channel {
      min-width: 0;
      padding-top: .85rem;
      border-top: 1px solid var(--line);
    }
    .contact-channel > gy-icon {
      margin-bottom: .4rem;
      color: var(--bronze);
      font-size: 1.15rem;
    }
    .contact-channel h2 {
      font-size: clamp(1.35rem, 2.5vw, 2rem);
    }
    .contact-channel h2 { text-wrap: wrap; }
    .contact-links {
      display: flex;
      flex-wrap: wrap;
      column-gap: .7rem;
      margin-top: .35rem;
    }
    .contact-links .text-link {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      font-size: 1rem;
      font-weight: 500;
    }
    .contact-channel p {
      margin: .15rem 0 0;
      color: var(--muted);
    }
    .request {
      display: grid;
      margin-top: clamp(1.5rem, 3vw, 2.5rem);
      overflow: hidden;
      border-radius: 1.1rem;
      background: radial-gradient(ellipse at 100% 0%, #344939, transparent 68%), #1c2a22;
      color: var(--light);
    }
    .request-photo {
      width: 100%;
      height: auto;
      align-self: center;
    }
    .request-copy {
      display: grid;
      align-content: center;
      justify-items: start;
      gap: .35rem;
      padding: clamp(1rem, 2.45vw, 2.6rem);
    }
    .request h2 { max-width: 18ch; font-size: clamp(1.45rem, 2.4vw, 2.25rem); text-wrap: balance; }
    .request .text-link {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      min-height: 44px;
      color: #f0ca91;
    }
    .request .text-link:hover { color: var(--light); }
    .request .text-link:focus-visible { outline-color: #f0ca91; }
    .contact-area {
      margin: clamp(1.25rem, 3vw, 2.4rem) 0 0;
      padding-top: clamp(.85rem, 2vw, 1.3rem);
      border-top: 1px solid var(--line);
      color: var(--muted);
    }
    @media (min-width: 760px) {
      .channels { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 1fr); }
    }
    @media (min-width: 860px) {
      .request { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
    }
  `],
  template: `
    <div class="wrap page-space">
      <nav class="breadcrumbs" aria-label="Ваш шлях"><a routerLink="/">Головна</a><span aria-current="page">Контакти</span></nav>
      <h1>Як вам зручно зв’язатися?</h1>

      <div class="channels">
        <section class="contact-channel" aria-labelledby="call-title">
          <gy-icon name="phone"/>
          <h2 id="call-title">Зателефонувати</h2>
          <div class="contact-links"><a class="text-link" [href]="phoneLink">+380 (50) 355-55-56</a></div>
          <p>Багатоканальний номер для питань про гірлянди, замовлення й монтаж</p>
        </section>
        <section class="contact-channel" aria-labelledby="chat-title">
          <gy-icon name="chat"/>
          <h2 id="chat-title">Написати в чат</h2>
          <div class="contact-links">
            <a class="text-link" [href]="viberLink">Viber</a>
            <a class="text-link" [href]="whatsappLink" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a class="text-link" href="https://t.me/serg_mus" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
          <p>Можна надіслати фото об’єкта</p>
        </section>
        <section class="contact-channel" aria-labelledby="email-title">
          <gy-icon name="mail"/>
          <h2 id="email-title">Написати листа</h2>
          <div class="contact-links"><a class="text-link" href="mailto:umt1@ukr.net">umt1@ukr.net</a></div>
          <p>З деталями або вкладеннями</p>
        </section>
      </div>

      <section class="request" aria-labelledby="request-title">
        <img class="request-photo" src="/media/contact-installation-banner.webp"
          srcset="/media/contact-installation-banner-small.webp 660w, /media/contact-installation-banner.webp 1500w"
          sizes="(min-width: 1408px) 854px, (min-width: 980px) calc(66.67vw - 5.34rem), (min-width: 860px) calc(66.67vw - 2.67rem), (min-width: 680px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
          width="1500" height="500"
          alt="Червоний трамвай у новорічних гірляндах і перехожа на засніженій вулиці">
        <div class="request-copy">
          <h2 id="request-title">Святкове оформлення під ключ</h2>
          <a class="text-link" routerLink="/zaiavka">Заявка на монтаж <gy-icon name="arrow-right"/></a>
        </div>
      </section>

      <p class="contact-area">Київ · Дистанційні консультації та виїзд на об’єкт</p>
    </div>
  `,
})
export class ContactPage {
  readonly phoneLink = `tel:${phone}`;
  readonly viberLink = `viber://chat?number=${encodeURIComponent(phone)}`;
  readonly whatsappLink = `https://wa.me/${phone.slice(1)}`;
}
