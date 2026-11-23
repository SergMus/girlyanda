import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { archivedIcicles, assortment, legacySnowflake } from './catalog/assortment';
import { categories } from './catalog/categories';
import { portfolioGalleries } from './studio/projects';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'katalog/:category/:subcategory',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return categories.flatMap(category => category.children.map(child => ({
        category: category.id, subcategory: child.id,
      })));
    },
  },
  {
    path: 'katalog/:category',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return categories.map(category => ({category: category.id}));
    },
  },
  {
    path: 'tovar/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return [...assortment, ...archivedIcicles, legacySnowflake].map(product => ({slug: product.slug}));
    },
  },
  {
    path: 'roboty/:category',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return portfolioGalleries.map(gallery => ({category: gallery.id}));
    },
  },
  ...['', 'katalog', 'montazh', 'roboty', 'pro-nas', 'zaiavka', 'kontakty', 'koshyk', 'zamovlennia'].map(path => ({
    path, renderMode: RenderMode.Prerender as const,
  })),
  {path: '**', renderMode: RenderMode.Client},
];
