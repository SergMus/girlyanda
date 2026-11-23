import { Location } from '@angular/common';
import { Component, HostListener, computed, inject, signal, viewChild, ElementRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { categories } from './catalog/categories';
import { CartStore } from './orders/cart.store';
import { IconComponent } from './shared/icons.component';

const links = [
  {label: 'Головна', url: '/'},
  {label: 'Каталог', url: '/katalog'},
  {label: 'Монтаж', url: '/montazh'},
  {label: 'Наші роботи', url: '/roboty'},
  {label: 'Про нас', url: '/pro-nas'},
  {label: 'Заявка на монтаж', url: '/zaiavka'},
  {label: 'Контакти', url: '/kontakty'},
];

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly rootHeader = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly url = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects),
  ), {initialValue: inject(Location).path() || '/'});

  readonly home = computed(() => this.url().split(/[?#]/)[0] === '/');
  readonly panel = signal<'catalog' | 'navigation' | 'search' | null>(null);
  readonly active = signal(categories[0]);
  readonly expanded = signal<string | null>(null);
  readonly categories = categories;
  readonly links = links;
  readonly cart = inject(CartStore);
  private trigger: HTMLElement | null = null;

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.close();
      const route = this.router.routerState.snapshot.root.firstChild;
      const description = route?.data['description'] as string | undefined;
      this.meta.updateTag({name: 'description', content: description ?? 'Гірлянди для дому, саду й бізнесу. Проєктування та професійний монтаж святкового освітлення.'});
      if (route?.data['noIndex']) this.meta.updateTag({name: 'robots', content: 'noindex'});
      else this.meta.removeTag('name="robots"');
    });
  }

  toggle(panel: 'catalog' | 'navigation' | 'search', event: Event): void {
    if (this.panel() === panel) {
      this.close(true);
      return;
    }
    this.trigger = event.currentTarget as HTMLElement;
    this.panel.set(panel);
    if (panel === 'search') setTimeout(() => this.rootHeader().nativeElement.querySelector('input')?.focus());
  }

  close(restoreFocus = false): void {
    if (!this.panel()) return;
    this.panel.set(null);
    this.expanded.set(null);
    if (restoreFocus) this.trigger?.focus();
    this.trigger = null;
  }

  @HostListener('document:keydown.escape')
  escape(): void {
    this.close(true);
  }

  @HostListener('document:pointerdown', ['$event'])
  dismissOutside(event: PointerEvent): void {
    if (!this.rootHeader().nativeElement.contains(event.target as Node)) this.close();
  }

  search(event: SubmitEvent, value: string): void {
    event.preventDefault();
    const q = value.trim();
    this.close();
    void this.router.navigate(['/katalog'], {queryParams: q ? {q} : {}});
  }
}
