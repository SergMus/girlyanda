import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { field, InstallationSubmissionError, SubmissionGateway } from '../orders/submission.gateway';
import { IconComponent } from '../shared/icons.component';

const allowed = ['image/jpeg', 'image/png', 'image/webp'];
const photoLimit = 10 * 1024 * 1024;
const blank = '________';
const lightingFields = ['Колір світіння', 'Колір проводу'] as const;

interface IdeaBrief {
  readonly label: string;
  readonly text: string;
  readonly fields: readonly string[];
}

@Component({
  imports: [RouterLink, IconComponent],
  styles: [`
    .contact-story { display: grid; align-items: center; gap: clamp(1.25rem, 4vw, 4rem); }
    .contact-story h1 { font-size: clamp(2.45rem, 4.5vw, 4.4rem); max-width: 14ch; }
    .contact-story p { margin: .95rem 0 0; max-width: 40ch; }
    .contact-photo { width: 100%; height: auto; }
    .contact-body { margin-top: clamp(2rem, 5vw, 4rem); }
    .idea-section h2, .form-intro h2 { font-size: clamp(1.65rem, 2.5vw, 2.25rem); }
    .idea-section > p { margin: .55rem 0 1.2rem; color: var(--muted); }
    .contact-ideas {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3.3rem .65rem;
      padding-top: 2.5rem;
    }
    .contact-idea {
      --idea-surface: #fbf7ee;
      --idea-padding: clamp(.65rem, 2vw, 1.2rem);
      position: relative;
      display: grid;
      align-content: start;
      justify-items: start;
      gap: .5rem;
      border: 1px solid var(--line);
      border-radius: 1rem;
      padding: clamp(2.65rem, 4vw, 3.3rem) var(--idea-padding) var(--idea-padding);
      background: var(--idea-surface);
      text-align: left;
      transition: background .18s ease, border-color .18s ease;
    }
    .contact-idea:hover { --idea-surface: var(--sand); border-color: #a67c51; }
    .idea-icon {
      position: absolute;
      inset: 0 auto auto var(--idea-padding);
      transform: translateY(-50%);
      display: inline-grid;
      place-items: center;
      width: clamp(4.2rem, 6vw, 5rem);
      aspect-ratio: 1;
      border: 1px solid #ab8257;
      border-radius: 50%;
      background: var(--idea-surface);
      box-shadow: inset 0 0 0 2px var(--idea-surface), inset 0 0 0 3px #e2cdb3;
      color: var(--bronze);
      font-size: clamp(2.4rem, 3.5vw, 2.85rem);
    }
    .idea-label { font-family: var(--display); font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 700; line-height: 1.2; color: #263c2e; }
    .idea-detail { font-size: .89rem; line-height: 1.45; color: var(--muted); }
    .form-intro p { margin: .55rem 0 .25rem; }
    .form-intro p, .contact-email { color: var(--muted); }
    .contact-email { font-size: .89rem; }
    @media (min-width: 760px) {
      .contact-story { grid-template-columns: minmax(0, .72fr) minmax(0, 1.28fr); }
    }
  `],
  template: `
    <div class="wrap page-space">
      <nav class="breadcrumbs" aria-label="Ваш шлях"><a routerLink="/">Головна</a><span aria-current="page">Заявка на монтаж</span></nav>
      <section class="contact-story" aria-labelledby="contact-story-title">
        <div>
          <h1 id="contact-story-title">Тепле світло для зимових вечорів</h1>
          <p class="lead">На зимовій вулиці погляд притягує повітряна куля з гірлянд. Біля вашого дому чи крамниці святкове оформлення теж може початися з однієї деталі.</p>
        </div>
        <img class="contact-photo beveled" src="/media/contact-light-installation.webp"
          srcset="/media/contact-light-installation-small.webp 640w, /media/contact-light-installation.webp 1600w"
          sizes="(min-width: 1408px) 778px, (min-width: 760px) 54vw, (min-width: 680px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
          width="1600" height="900" fetchpriority="high"
          alt="Світлова фігура у формі повітряної кулі серед засніженої вулиці">
      </section>
      <div class="columns contact-body">
        <section class="idea-section" aria-labelledby="contact-ideas-title">
          <h2 id="contact-ideas-title">Що оформлюємо</h2>
          <p>Оберіть ідею, щоб додати її до заявки.</p>
          <div class="contact-ideas" role="group" aria-labelledby="contact-ideas-title">
            @for (idea of ideas; track idea.icon) {
              <button type="button" class="contact-idea" aria-controls="installation-description"
                [attr.aria-labelledby]="'idea-' + idea.icon" [attr.aria-describedby]="'idea-detail-' + idea.icon"
                (click)="addIdea(description, idea)">
                <span class="idea-icon" aria-hidden="true"><gy-icon [name]="idea.icon"/></span>
                <span class="idea-label" [id]="'idea-' + idea.icon">{{ idea.label }}</span>
                <span class="idea-detail" [id]="'idea-detail-' + idea.icon">{{ idea.detail }}</span>
              </button>
            }
          </div>
        </section>
        <form class="form-card" aria-labelledby="installation-form-title" (submit)="submit($event)">
          <div class="form-intro">
            <h2 id="installation-form-title">Заявка на монтаж</h2>
            <p>Опишіть свою ідею або доповніть підкреслені місця в підказці. Орієнтовних розмірів достатньо. За можливості додайте фото й бажану дату.</p>
          </div>
          <div class="form-grid">
            <label>Ім’я <input name="name" autocomplete="name" required maxlength="80"></label>
            <label>Телефон <input name="phone" type="tel" autocomplete="tel" required minlength="7" maxlength="25"></label>
          </div>
          <label>Тип об’єкта
            <select name="object" required><option value="">Оберіть об’єкт</option><option>Приватний будинок</option>
              <option>Фасад</option><option>Тераса або альтанка</option><option>Ресторан чи інший бізнес</option><option>Інше</option>
            </select>
          </label>
          <label>Що потрібно підсвітити?
            <textarea #description id="installation-description" name="description" rows="6" required maxlength="1600"
              placeholder="Наприклад, тепла бахрома вздовж даху й гірлянди на двох деревах."></textarea>
          </label>
          <label class="upload-field">
            <span><gy-icon name="upload"/> Додайте фото об’єкта</span>
            <input #file type="file" accept="image/jpeg,image/png,image/webp" (change)="selectPhoto(file)">
            <small>JPEG, PNG, WebP до 10 МБ</small>
          </label>
          @if (preview(); as src) {
            <figure class="attachment"><img [src]="src" alt="Попередній перегляд фото об’єкта" width="144" height="94">
            <figcaption>{{ photo()?.name }} <button class="text-link" type="button" (click)="removePhoto(file)">Видалити</button></figcaption></figure>
          }
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
          @if (emailDraft(); as draft) {
            <p class="contact-email"><a class="text-link" [href]="draft">Відкрити підготовлений лист</a>
              і за потреби прикріпити фото в поштовому застосунку.</p>
          }
          @if (receipt()) { <p class="notice" role="status">Заявку {{ receipt() }} надіслано. Ми зв’яжемося з вами за вказаним номером.</p> }
          <button type="submit" class="button gold" [disabled]="busy()" [attr.aria-busy]="busy()">
            {{ busy() ? 'Надсилання…' : 'Надіслати заявку' }}</button>
        </form>
      </div>
    </div>
  `,
})
export class InstallationRequestPage {
  private readonly gateway = inject(SubmissionGateway);
  readonly busy = signal(false);
  readonly photo = signal<File | null>(null);
  readonly preview = signal('');
  readonly receipt = signal('');
  readonly error = signal('');
  readonly emailDraft = signal('');
  readonly ideas = [
    {
      label: 'Карнизи й фасади', icon: 'eave', detail: 'Бахрома вздовж даху та гірлянди навколо входу.',
      text: 'Бахрома вздовж карниза.',
      fields: [...lightingFields, 'Довжина карниза (м)', 'Поверх або висота монтажу (м)'],
    },
    {
      label: 'Дерева й кущі', icon: 'tree', detail: 'Світлові нитки на стовбурах і гілках та сітки для кущів.',
      text: 'Світлова нитка навколо стовбура й гілок.',
      fields: [...lightingFields, 'Кількість дерев або кущів', 'До якої висоти підсвітити (м)'],
    },
    {
      label: 'Вітрини й входи', icon: 'storefront', detail: 'Світлові завіси у вікнах і гірлянди навколо дверей.',
      text: 'Світлова завіса біля вітрини.',
      fields: [...lightingFields, 'Ширина й висота вітрини (м)', 'Чи потрібно оформити вхід'],
    },
    {
      label: 'Тераси й альтанки', icon: 'terrace', detail: 'Ретрогірлянди над столом і зоною відпочинку.',
      text: 'Ретрогірлянди над зоною відпочинку на терасі.',
      fields: [...lightingFields, 'Довжина й ширина зони (м)', 'Де можна закріпити гірлянду'],
    },
    {
      label: 'Світлові фігури', icon: 'balloon', detail: 'Об’ємні прикраси біля входу, у дворі чи у фотозоні.',
      text: 'Об’ємна світлова фігура біля входу.',
      fields: ['Колір світіння', 'Бажана форма й висота (м)', 'Де стоятиме фігура'],
    },
    {
      label: 'Доріжки й огорожі', icon: 'pathway', detail: 'Світлові акценти біля сходинок і гірлянди вздовж огорожі.',
      text: 'Підсвітка доріжки, сходинок або огорожі.',
      fields: [...lightingFields, 'Яку ділянку підсвітити', 'Орієнтовна довжина ділянки (м)'],
    },
  ] as const;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearPhoto());
  }

  addIdea(description: HTMLTextAreaElement, idea: IdeaBrief): void {
    const current = description.value;
    const prefix = current ? current + (current.endsWith('\n') ? '\n' : '\n\n') : '';
    const brief = [idea.label, idea.text, ...idea.fields.map(field => field + ' ' + blank)].join('\n');
    const next = prefix + brief;
    description.focus();
    if (!current.split('\n').includes(idea.label) && next.length <= description.maxLength) {
      description.value = next;
      const firstBlank = prefix.length + brief.indexOf(blank);
      description.setSelectionRange(firstBlank, firstBlank + blank.length);
    }
  }

  selectPhoto(input: HTMLInputElement): void {
    this.clearPhoto();
    this.error.set('');
    const file = input.files?.[0];
    if (!file) return;
    if (!allowed.includes(file.type) || file.size > photoLimit || file.size === 0) {
      input.value = '';
      this.error.set('Оберіть зображення JPEG, PNG або WebP розміром до 10 МБ.');
      return;
    }
    this.photo.set(file);
    this.preview.set(URL.createObjectURL(file));
  }

  removePhoto(input: HTMLInputElement): void {
    this.clearPhoto();
    input.value = '';
  }

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.busy()) return;
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = field(data, 'name');
    const phone = field(data, 'phone');
    const objectType = field(data, 'object');
    const description = field(data, 'description');
    this.error.set('');
    this.receipt.set('');
    this.emailDraft.set('');
    if (!name || phone.replace(/\D/g, '').length < 7 || !objectType || !description) {
      this.error.set('Заповніть обов’язкові поля та перевірте номер телефону.');
      return;
    }
    this.busy.set(true);
    try {
      this.receipt.set(await this.gateway.sendInstallation({name, phone, objectType, description, photo: this.photo()}));
      this.clearPhoto();
      form.reset();
    } catch (error) {
      const body = [
        'Ім’я: ' + name,
        'Телефон: ' + phone,
        'Тип об’єкта: ' + objectType,
        '',
        description,
      ].join('\r\n');
      this.emailDraft.set('mailto:umt1@ukr.net?subject=' + encodeURIComponent('Заявка на монтаж Girlyanda') + '&body=' + encodeURIComponent(body));
      this.error.set(error instanceof InstallationSubmissionError && error.status === 503
        ? 'Надсилання через форму тимчасово недоступне. Скористайтеся підготовленим листом.'
        : 'Надіслати заявку не вдалося. Спробуйте ще раз або надішліть її поштою.');
    } finally {
      this.busy.set(false);
    }
  }

  private clearPhoto(): void {
    if (this.preview()) URL.revokeObjectURL(this.preview());
    this.preview.set('');
    this.photo.set(null);
  }
}
