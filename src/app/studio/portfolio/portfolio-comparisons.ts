import { HOUSE_COMPARISON_IMAGES } from '../../shared/compare/comparison-images';

export const SHOPPING_CENTER_COMPARISON = {
  title: 'Як світло змінює фасад',
  description: 'Пересуньте повзунок, щоб порівняти фасад до та після монтажу гірлянд.',
  wideOnMobile: true,
  images: {
    before: { src: '/media/portfolio-mall-before.webp', alt: 'Фасад торгового центру вдень до монтажу' },
    after: {
      src: '/media/portfolio-mall-after-original-decor.webp',
      alt: 'Торговий центр із тепло-білими завісами й фігурами з дюралайту. У клумбах дві групи світлових куль, праворуч подарунок із червоним бантом.',
    },
  },
};

export const HOUSE_COMPARISON = {
  title: 'Фасад до та після монтажу',
  description: null,
  wideOnMobile: false,
  images: HOUSE_COMPARISON_IMAGES,
};
