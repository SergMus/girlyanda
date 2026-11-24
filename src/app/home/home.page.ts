import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogRepository } from '../catalog/catalog.repository';
import { categories } from '../catalog/categories';
import { ProductCardComponent } from '../catalog/product-card.component';
import { CompareComponent } from '../shared/compare.component';
import { IconComponent } from '../shared/icons.component';

@Component({
  imports: [RouterLink, ProductCardComponent, CompareComponent, IconComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly destroy = inject(DestroyRef);
  private autoplay = false;
  readonly playing = signal(false);
  readonly categories = categories;
  readonly ideaPhotos = [
    {
      category: 'zamiski-budynky',
      title: 'Заміські будинки',
      detail: 'Святкове освітлення дахів, фасадів і входів приватних будинків.',
      src: '/media/modern-country-house.webp',
      width: 2270,
      height: 1254,
      crop: 'screenshot',
    },
    {
      category: 'komertsiini-obiekty',
      title: 'Комерційні об’єкти',
      detail: 'Світлове оформлення фасадів і вітрин магазинів, кафе та готелів.',
      src: '/media/cafe.webp',
      width: 1200,
      height: 600,
    },
    {
      category: 'prostory-dereva-yalynky',
      title: 'Простори, дерева, ялинки',
      detail: 'Гірлянди для терас і садових доріжок, підсвічування дерев і ялинок.',
      src: '/media/illuminated-city-square.webp',
      width: 1200,
      height: 1112,
      crop: 'city-square',
    },
  ];
  private readonly catalog = inject(CatalogRepository);
  readonly featured = computed(() => this.catalog.products().filter(item => item.featured));

  constructor() {
    afterNextRender(() => {
      const element = this.video().nativeElement;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      if (!motion.matches && matchMedia('(min-width: 768px)').matches &&
        !('connection' in navigator && (navigator.connection as {saveData?: boolean}).saveData)) {
        this.autoplay = true;
        const timer = setTimeout(() => {
          if (this.autoplay && element.getBoundingClientRect().bottom > 0) this.play(element);
        }, 1100);
        this.destroy.onDestroy(() => clearTimeout(timer));
      }
      const observer = new IntersectionObserver(entries => {
        if (!entries[0]?.isIntersecting) element.pause();
      }, {threshold: .15});
      observer.observe(element);
      const pauseOnReducedMotion = () => { if (motion.matches) { this.autoplay = false; element.pause(); } };
      motion.addEventListener('change', pauseOnReducedMotion);
      this.destroy.onDestroy(() => {
        observer.disconnect();
        motion.removeEventListener('change', pauseOnReducedMotion);
      });
    });
  }

  toggleVideo(): void {
    this.autoplay = false;
    const element = this.video().nativeElement;
    if (element.paused) this.play(element);
    else element.pause();
  }

  private play(element: HTMLVideoElement): void {
    if (!element.getAttribute('src')) element.src = '/media/hero.webm';
    element.muted = true;
    void element.play().catch(() => this.playing.set(false));
  }
}
