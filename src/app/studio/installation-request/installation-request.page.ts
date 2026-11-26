import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallationSubmissionError, SubmissionGateway } from '../../orders/submission.gateway';
import { field } from '../../shared/form-data';
import { IconComponent } from '../../shared/icons/icons.component';
import { hasMinimumPhoneDigits } from '../../shared/phone-number';
import type { IdeaBrief } from './idea-brief';
import {
  ALLOWED_PHOTO_TYPES,
  PHOTO_SIZE_LIMIT,
  FIELD_PLACEHOLDER,
  INSTALLATION_IDEAS,
} from './installation-request-data';

@Component({
  imports: [RouterLink, IconComponent],
  styleUrl: './installation-request.page.scss',
  templateUrl: './installation-request.page.html',
})
export class InstallationRequestPage {
  private readonly gateway = inject(SubmissionGateway);
  private readonly destroy = inject(DestroyRef);

  readonly busy = signal(false);
  readonly photo = signal<File | null>(null);
  readonly preview = signal('');
  readonly receipt = signal('');
  readonly error = signal('');
  readonly emailDraft = signal('');
  readonly ideas = INSTALLATION_IDEAS;

  constructor() {
    this.destroy.onDestroy(() => this.clearPhoto());
  }

  addIdea(description: HTMLTextAreaElement, idea: IdeaBrief): void {
    const current = description.value;
    const prefix = current ? current + (current.endsWith('\n') ? '\n' : '\n\n') : '';
    const brief = [idea.label, idea.text, ...idea.fields.map(field => field + ' ' + FIELD_PLACEHOLDER)].join('\n');
    const next = prefix + brief;
    description.focus();

    if (!current.split('\n').includes(idea.label) && next.length <= description.maxLength) {
      description.value = next;
      const firstBlank = prefix.length + brief.indexOf(FIELD_PLACEHOLDER);
      description.setSelectionRange(firstBlank, firstBlank + FIELD_PLACEHOLDER.length);
    }
  }

  selectPhoto(input: HTMLInputElement): void {
    this.clearPhoto();
    this.error.set('');
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_PHOTO_TYPES.includes(file.type) || file.size > PHOTO_SIZE_LIMIT || file.size === 0) {
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

    if (this.busy()) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = field(data, 'name');
    const phone = field(data, 'phone');
    const objectType = field(data, 'object');
    const description = field(data, 'description');
    this.error.set('');
    this.receipt.set('');
    this.emailDraft.set('');

    const hasRequiredDetails = Boolean(name && objectType && description);

    if (!hasRequiredDetails || !hasMinimumPhoneDigits(phone)) {
      this.error.set('Заповніть обов’язкові поля та перевірте номер телефону.');

      return;
    }

    this.busy.set(true);

    try {
      this.receipt.set(
        await this.gateway.sendInstallation({ name, phone, objectType, description, photo: this.photo() }),
      );
      this.clearPhoto();
      form.reset();
    } catch (error) {
      const body = ['Ім’я: ' + name, 'Телефон: ' + phone, 'Тип об’єкта: ' + objectType, '', description].join('\r\n');
      this.emailDraft.set(
        'mailto:umt1@ukr.net?subject=' +
          encodeURIComponent('Заявка на монтаж Girlyanda') +
          '&body=' +
          encodeURIComponent(body),
      );
      this.error.set(
        error instanceof InstallationSubmissionError && error.status === 503
          ? 'Надсилання через форму тимчасово недоступне. Скористайтеся підготовленим листом.'
          : 'Надіслати заявку не вдалося. Спробуйте ще раз або надішліть її поштою.',
      );
    } finally {
      this.busy.set(false);
    }
  }

  private clearPhoto(): void {
    if (this.preview()) {
      URL.revokeObjectURL(this.preview());
    }

    this.preview.set('');
    this.photo.set(null);
  }
}
