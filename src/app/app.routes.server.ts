import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { ARCHIVED_ICICLES, ASSORTMENT, LEGACY_SNOWFLAKE } from './catalog/assortment';
import { CATEGORIES } from './catalog/categories';
import { PORTFOLIO_GALLERIES } from './studio/projects';

export const SERVER_ROUTES: ServerRoute[] = [
  {
    path: 'katalog/:category/:subcategory',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return CATEGORIES.flatMap(category =>
        category.children.map(child => ({
          category: category.id,
          subcategory: child.id,
        })),
      );
    },
  },
  {
    path: 'katalog/:category',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return CATEGORIES.map(category => ({ category: category.id }));
    },
  },
  {
    path: 'tovar/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return [...ASSORTMENT, ...ARCHIVED_ICICLES, LEGACY_SNOWFLAKE].map(product => ({ slug: product.slug }));
    },
  },
  {
    path: 'roboty/:category',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return PORTFOLIO_GALLERIES.map(gallery => ({ category: gallery.id }));
    },
  },
  ...['', 'katalog', 'montazh', 'roboty', 'pro-nas', 'zaiavka', 'kontakty', 'koshyk', 'zamovlennia'].map(path => ({
    path,
    renderMode: RenderMode.Prerender as const,
  })),
  { path: '**', renderMode: RenderMode.Client },
];
