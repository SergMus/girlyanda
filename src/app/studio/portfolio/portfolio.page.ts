import { Component, computed, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CompareComponent } from '../../shared/compare/compare.component';
import { PORTFOLIO_GALLERIES } from '../projects';
import { SHOPPING_CENTER_COMPARISON, HOUSE_COMPARISON } from './portfolio-comparisons';

@Component({
  imports: [RouterLink, CompareComponent],
  templateUrl: './portfolio.page.html',
  styleUrl: './portfolio.page.scss',
})
export class PortfolioPage {
  readonly category = input<string>();

  private readonly gallery = viewChild<ElementRef<HTMLDialogElement>>('gallery');

  private readonly titleService = inject(Title);

  readonly galleries = PORTFOLIO_GALLERIES;
  readonly selected = computed(() => this.galleries.find(gallery => gallery.id === this.category()));
  readonly valid = computed(() => !this.category() || !!this.selected());
  readonly heading = computed(() =>
    !this.valid() ? 'Галерею не знайдено' : (this.selected()?.title ?? 'Наші роботи'),
  );
  readonly entries = computed(() => {
    const selected = this.selected();
    const galleries = selected ? [selected] : this.galleries;

    return galleries.flatMap(gallery => gallery.works.map(work => ({ work, galleryTitle: gallery.title })));
  });
  readonly comparison = computed(() => {
    switch (this.category()) {
      case undefined:
      case 'komertsiini-obiekty':
        return SHOPPING_CENTER_COMPARISON;
      case 'zamiski-budynky':
        return HOUSE_COMPARISON;
      default:
        return null;
    }
  });

  readonly viewedIndex = signal<number | null>(null);
  readonly viewed = computed(() => {
    const index = this.viewedIndex();

    return index === null ? undefined : this.entries()[index]?.work;
  });

  constructor() {
    effect(() => {
      const heading = this.heading();
      const pageTitle = `${heading} | Girlyanda`;

      this.titleService.setTitle(pageTitle);
    });

    effect(() => {
      this.category();
      const dialog = this.gallery()?.nativeElement;

      if (dialog?.open) {
        dialog.close();
      }
    });
  }

  open(index: number): void {
    this.viewedIndex.set(index);
    this.gallery()?.nativeElement.showModal();
  }

  step(offset: number): void {
    const count = this.entries().length;
    this.viewedIndex.update(index => (index === null || count < 2 ? index : (index + offset + count) % count));
  }

  keyboardStep(event: Event, offset: number): void {
    event.preventDefault();
    this.step(offset);
  }
}
