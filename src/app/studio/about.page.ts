import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  styles: [`
    .about-intro { max-width: 68ch; margin: .9rem 0 clamp(1.4rem, 3vw, 2rem); }
    .about-photo { width: 100%; height: auto; aspect-ratio: 16 / 10; object-position: 30% 55%; }
    .about-bridge {
      max-width: 62ch;
      margin: clamp(1.35rem, 3vw, 2.5rem) 0;
      padding-left: 1rem;
      border-left: 2px solid #baa48c;
      color: #625c54;
      font: 520 clamp(1.03rem, 2vw, 1.35rem) / 1.55 var(--display);
    }
    .about-range, .about-support { margin-top: clamp(2.2rem, 6vw, 5rem); }
    .about-story { display: grid; align-items: center; gap: clamp(1.15rem, 4vw, 3.75rem); }
    .story-photo { width: 100%; height: auto; }
    h2 { font-size: clamp(1.85rem, 3.5vw, 3.1rem); }
    h3 { font-size: clamp(1.16rem, 1.8vw, 1.45rem); }
    .about-story p, .range-details p { margin: .65rem 0 0; color: var(--muted); }
    .button-row { gap: .25rem 1.25rem; margin-top: .7rem; }
    .text-link { display: inline-flex; align-items: center; min-height: 44px; }
    .range-details { display: grid; gap: 1.4rem; }
    .range-card { min-width: 0; background: #f0e8dc; border-radius: .75rem; }
    .range-card-copy { padding: clamp(1rem, 2.5vw, 1.65rem); }
    .range-photo {
      width: 100%;
      height: auto;
      aspect-ratio: 5 / 2;
      object-fit: cover;
      border-radius: .75rem .75rem 0 0;
    }
    .about-support {
      display: grid;
      border-radius: .75rem;
      background: radial-gradient(ellipse at 0 0, #344939, transparent 78%), #1c2a22;
      color: var(--light);
    }
    .support-copy { align-self: center; padding: clamp(1.2rem, 3.6vw, 3rem); }
    .support-copy h2 { font-size: clamp(1.7rem, 3vw, 2.6rem); }
    .support-copy p { max-width: 56ch; margin: .7rem 0 0; color: #e0e5d9; }
    .support-copy .text-link { margin-top: .5rem; color: #f0ca91; }
    .support-copy .text-link:hover, .support-copy .text-link:focus-visible { color: var(--light); outline-color: #f0ca91; }
    .support-media { position: relative; min-height: clamp(9rem, 42vw, 15rem); }
    .support-media img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 43% center;
      border-radius: 0 0 .75rem .75rem;
    }
    @media (min-width: 680px) {
      .about-photo { aspect-ratio: 2.77; object-position: 50% 55%; }
      .range-details { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); }
      .range-photo { height: clamp(8rem, 16.5vw, 15rem); aspect-ratio: auto; }
    }
    @media (min-width: 860px) {
      .about-story { grid-template-columns: minmax(0, 1.07fr) minmax(0, 1fr); }
      .story-photo { order: -1; }
    }
    @media (min-width: 1080px) {
      .about-support { grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr); }
      .support-media img { border-radius: 0 .75rem .75rem 0; }
    }
  `],
  template: `
    <div class="wrap page-space">
      <nav class="breadcrumbs" aria-label="Ваш шлях"><a routerLink="/">Головна</a><span aria-current="page">Про нас</span></nav>
      <h1>Про Girlyanda</h1>
      <p class="lead about-intro">Girlyanda — магазин гірлянд і студія святкового освітлення для дому та бізнесу. Проєктуємо й монтуємо новорічну ілюмінацію та допомагаємо підібрати гірлянди для самостійного оформлення.</p>
      <img class="about-photo beveled" src="/media/about-terrace.webp"
        srcset="/media/about-terrace-small.webp 640w, /media/about-terrace.webp 1440w"
        sizes="(min-width: 1408px) 1280px, (min-width: 980px) calc(100vw - 8rem), (min-width: 680px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
        width="1440" height="720" fetchpriority="high"
        alt="Вечірня тераса з ретрогірляндами й теплими вогниками на стовбурі дерева та в кущах">

      <p class="about-bridge">Коли темніє, світло змінює те, як ми бачимо знайоме місце. Ми продумуємо цей момент ще до монтажу.</p>

      <section class="about-story" aria-labelledby="about-story-title">
        <div>
          <h2 id="about-story-title">Досвід у дизайні й монтажі</h2>
          <p>Маємо великий досвід у святковому оформленні. Реалізували багато проєктів для дому й бізнесу, від підсвітки карнизів, садових дерев і терас до оформлення вітрин, входів і цілих фасадів.</p>
          <p>Починаємо з фото або замірів. Визначаємо, які деталі підкреслити світлом, узгоджуємо відтінок і щільність вогників, підбираємо кріплення й точки живлення. Після монтажу перевіряємо, як усе виглядає в темряві.</p>
          <div class="button-row">
            <a class="text-link" routerLink="/roboty">Наші роботи</a>
            <a class="text-link" routerLink="/montazh">Як відбувається монтаж</a>
          </div>
        </div>
        <img class="story-photo beveled" src="/media/about-decorator.webp"
          srcset="/media/about-decorator-small.webp 640w, /media/about-decorator.webp 1440w"
          sizes="(min-width: 1408px) 630px, (min-width: 860px) 47vw, (min-width: 680px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
          width="1440" height="960" loading="lazy"
          alt="Декораторка закріплює теплі вогники на хвойній гірлянді біля вітрини">
      </section>

      <section class="about-range" aria-labelledby="about-range-title">
        <div class="section-heading">
          <h2 id="about-range-title">Гірлянди для вулиці й інтер’єру</h2>
          <a class="text-link" routerLink="/katalog">До каталогу</a>
        </div>
        <div class="range-details">
          <article class="range-card">
            <img class="range-photo" src="/media/about-exterior.webp" width="1200" height="480" loading="lazy"
              alt="Холодно-біла бахрома на карнизі цегляного будинку й новорічний вінок на вхідних дверях">
            <div class="range-card-copy">
              <h3>Для фасадів і саду</h3>
              <p>Бахрома окреслює карниз, а світлова нитка підкреслює гілки. Для вулиці пропонуємо сертифіковані гірлянди й підбираємо ступінь захисту від вологи та пилу під умови монтажу.</p>
            </div>
          </article>
          <article class="range-card">
            <img class="range-photo" src="/media/about-interior.webp" width="1200" height="480" loading="lazy"
              alt="Тепла світлова завіса на вікні кафе з видом на засніжену вулицю">
            <div class="range-card-copy">
              <h3>Для приміщень</h3>
              <p>Світлова завіса додає глибини вітрині, а теплі вогники підкреслюють форму ялинки. Підбираємо довжину гірлянди, відтінок світла й колір проводу під ваш інтер’єр.</p>
            </div>
          </article>
        </div>
      </section>

      <section class="about-support" aria-labelledby="about-support-title">
        <div class="support-copy">
          <h2 id="about-support-title">На зв’язку й після свят</h2>
          <p>Після покупки чи монтажу залишаємося на зв’язку протягом року. Підкажемо, як підключити й зберігати гірлянди, а перед наступною зимою допоможемо доповнити наявне освітлення або оновити оформлення.</p>
          <a class="text-link" routerLink="/kontakty">Зв’язатися з нами</a>
        </div>
        <div class="support-media">
          <img src="/media/about-care.webp" width="1200" height="600" loading="lazy"
            alt="Фахівець укладає змотану світлову нитку в коробку">
        </div>
      </section>
    </div>
  `,
})
export class AboutPage {}
