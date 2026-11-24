import { Component, computed, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CompareComponent, houseImages } from '../shared/compare.component';
import { portfolioGalleries } from './projects';

const shoppingCenterComparison = {
  title: 'Як світло змінює фасад',
  description: 'Пересуньте повзунок, щоб порівняти фасад до та після монтажу гірлянд.',
  wideOnMobile: true,
  images: {
    before: {src: '/media/portfolio-mall-before.webp', alt: 'Фасад торгового центру вдень до монтажу'},
    after: {
      src: '/media/portfolio-mall-after-original-decor.webp',
      alt: 'Торговий центр із тепло-білими завісами й фігурами з дюралайту. У клумбах дві групи світлових куль, праворуч подарунок із червоним бантом.',
    },
  },
};

const houseComparison = {
  title: 'Фасад до та після монтажу',
  description: null,
  wideOnMobile: false,
  images: houseImages,
};

@Component({
  imports: [RouterLink, CompareComponent],
  templateUrl: './portfolio.page.html',
  styleUrl: './portfolio.page.scss',
})
export class PortfolioPage {
  readonly category = input<string>();
  readonly galleries = portfolioGalleries;
  readonly selected = computed(() => this.galleries.find(gallery => gallery.id === this.category()));
  readonly valid = computed(() => !this.category() || !!this.selected());
  readonly heading = computed(() => !this.valid()
    ? 'Галерею не знайдено'
    : this.selected()?.title ?? 'Наші роботи');
  readonly entries = computed(() => {
    const selected = this.selected();
    const galleries = selected ? [selected] : this.galleries;
    return galleries.flatMap(gallery => gallery.works.map(work => ({work, galleryTitle: gallery.title})));
  });
  readonly comparison = computed(() => {
    switch (this.category()) {
      case undefined:
      case 'komertsiini-obiekty':
        return shoppingCenterComparison;
      case 'zamiski-budynky':
        return houseComparison;
      default:
        return null;
    }
  });

  private readonly gallery = viewChild<ElementRef<HTMLDialogElement>>('gallery');
  readonly viewedIndex = signal<number | null>(null);
  readonly viewed = computed(() => {
    const index = this.viewedIndex();
    return index === null ? undefined : this.entries()[index]?.work;
  });

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(this.heading() + ' | Girlyanda'));
    effect(() => {
      this.category();
      const dialog = this.gallery()?.nativeElement;
      if (dialog?.open) dialog.close();
    });
  }

  open(index: number): void {
    this.viewedIndex.set(index);
    this.gallery()?.nativeElement.showModal();
  }

  step(offset: number): void {
    const count = this.entries().length;
    this.viewedIndex.update(index => index === null || count < 2 ? index : (index + offset + count) % count);
  }

  keyboardStep(event: Event, offset: number): void {
    event.preventDefault();
    this.step(offset);
  }
}
