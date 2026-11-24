import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', title: 'Girlyanda — святкове освітлення та монтаж', loadComponent: () => import('./home/home.page').then(m => m.HomePage)},
  {path: 'katalog', title: 'Каталог гірлянд | Girlyanda', data: {description: 'Каталог гірлянд Girlyanda. Порівняйте моделі, колір світіння й розміри.'}, loadComponent: () => import('./catalog/catalog.page').then(m => m.CatalogPage)},
  {path: 'katalog/:category', title: 'Каталог гірлянд | Girlyanda', data: {description: 'Каталог гірлянд Girlyanda. Порівняйте моделі, колір світіння й розміри.'}, loadComponent: () => import('./catalog/catalog.page').then(m => m.CatalogPage)},
  {path: 'katalog/:category/:subcategory', title: 'Каталог гірлянд | Girlyanda', data: {description: 'Каталог гірлянд Girlyanda. Порівняйте моделі, колір світіння й розміри.'}, loadComponent: () => import('./catalog/catalog.page').then(m => m.CatalogPage)},
  {path: 'tovar/:slug', loadComponent: () => import('./catalog/product.page').then(m => m.ProductPage)},
  {path: 'montazh', title: 'Монтаж святкового освітлення | Girlyanda', data: {description: 'Підбір, візуалізація й монтаж святкової ілюмінації для будинків, терас і комерційних об’єктів.'}, loadComponent: () => import('./studio/installation.page').then(m => m.InstallationPage)},
  {path: 'roboty', title: 'Наші роботи | Girlyanda', data: {description: 'Фото святкового освітлення будинків, комерційних об’єктів, просторів, дерев і ялинок.'}, loadComponent: () => import('./studio/portfolio.page').then(m => m.PortfolioPage)},
  {path: 'roboty/:category', title: 'Наші роботи | Girlyanda', data: {description: 'Фото святкового освітлення будинків, комерційних об’єктів, просторів, дерев і ялинок.'}, loadComponent: () => import('./studio/portfolio.page').then(m => m.PortfolioPage)},
  {path: 'pro-nas', title: 'Про нас | Girlyanda', data: {description: 'Girlyanda об’єднує каталог гірлянд і студію професійного монтажу святкової ілюмінації.'}, loadComponent: () => import('./studio/about.page').then(m => m.AboutPage)},
  {path: 'zaiavka', title: 'Заявка на монтаж | Girlyanda', data: {description: 'Заявка на монтаж святкового освітлення з фото будинку, фасаду або тераси.'}, loadComponent: () => import('./studio/installation-request.page').then(m => m.InstallationRequestPage)},
  {path: 'kontakty', title: 'Контакти | Girlyanda', data: {description: 'Girlyanda у Києві. Телефон, Viber, WhatsApp, Telegram та електронна пошта для запитань про гірлянди, замовлення й монтаж.'}, loadComponent: () => import('./studio/contact.page').then(m => m.ContactPage)},
  {path: 'koshyk', title: 'Кошик | Girlyanda', data: {noIndex: true}, loadComponent: () => import('./orders/cart.page').then(m => m.CartPage)},
  {path: 'zamovlennia', title: 'Оформлення замовлення | Girlyanda', data: {noIndex: true}, loadComponent: () => import('./orders/checkout.page').then(m => m.CheckoutPage)},
  {path: '**', title: 'Сторінку не знайдено | Girlyanda', data: {noIndex: true}, loadComponent: () => import('./shared/not-found.page').then(m => m.NotFoundPage)},
];
