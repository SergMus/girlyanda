import { NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CatalogRepository } from '../catalog.repository';
import { CATEGORIES } from '../categories';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Glow, GLOW_OPTIONS } from '../products';

@Component({
  imports: [RouterLink, ProductCardComponent, NgTemplateOutlet],
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage {
  readonly category = input<string>();
  readonly subcategory = input<string>();
  readonly q = input<string>();

  private readonly repository = inject(CatalogRepository);
  private readonly titleService = inject(Title);

  private readonly queryReady = signal(false);

  readonly search = linkedSignal(() => (this.queryReady() ? (this.q() ?? '') : ''));
  readonly glow = signal<Glow | ''>('');
  readonly order = signal('featured');
  readonly categories = CATEGORIES;
  readonly glowOptions = Object.entries(GLOW_OPTIONS);
  readonly section = computed(() => CATEGORIES.find(category => category.id === this.category()));
  readonly child = computed(() => this.section()?.children.find(option => option.id === this.subcategory()));
  readonly valid = computed(() => (!this.category() || !!this.section()) && (!this.subcategory() || !!this.child()));
  readonly title = computed(() =>
    this.valid() ? (this.section()?.name ?? 'Каталог гірлянд') : 'Категорію не знайдено',
  );
  readonly selectedGlow = computed(() => this.glow() || undefined);

  readonly products = computed(() => {
    const q = this.search().trim().toLocaleLowerCase('uk');
    const category = this.category();
    const child = this.subcategory();
    const glow = this.glow();

    const found = this.repository
      .products()
      .filter(
        product =>
          (!category || product.category === category) &&
          (!child || product.subcategories.includes(child)) &&
          (!q || (product.name + ' ' + product.description).toLocaleLowerCase('uk').includes(q)) &&
          (!glow || product.variants.some(variant => variant.glow === glow)),
      );

    return found.sort((a, b) => {
      switch (this.order()) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'uk');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'uk');
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
  });

  constructor() {
    afterNextRender(() => this.queryReady.set(true));

    effect(() => {
      const sectionTitle = this.title();
      const subcategoryTitle = this.child()?.name;
      const titleParts = [sectionTitle, subcategoryTitle, 'Girlyanda'];
      const pageTitle = titleParts.filter(Boolean).join(' | ');

      this.titleService.setTitle(pageTitle);
    });
  }

  changeGlow(value: string): void {
    this.glow.set(Object.hasOwn(GLOW_OPTIONS, value) ? (value as Glow) : '');
  }

  resetFilters(): void {
    this.glow.set('');
    this.search.set('');
    this.order.set('featured');
  }
}
