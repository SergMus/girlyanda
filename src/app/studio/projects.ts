export interface PortfolioImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

type PortfolioMedia =
  | {readonly kind: 'photo'; readonly preview: PortfolioImage}
  | {
      readonly kind: 'video';
      readonly preview: PortfolioImage;
      readonly src: string;
      readonly captions?: string;
    };

export interface PortfolioWork {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly location?: string;
  readonly media: PortfolioMedia;
}

interface PortfolioGallery {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly cover: PortfolioImage;
  readonly works: readonly PortfolioWork[];
}

function photo(file: string, alt: string, width = 1200, height = 600): PortfolioImage {
  return {src: '/media/' + file + '.webp', alt, width, height};
}

const cottage = photo('house-after', 'Заміський будинок із теплими гірляндами вздовж карнизів');
const stoneHouse = photo('hero', 'Кам’яний будинок із підсвіченим входом, карнизами та садом', 1600, 900);
const cafe = photo('cafe', 'Вечірня вітрина кафе зі світловою завісою');
const hotel = photo('hotel-entrance', 'Вхід до готелю з гірляндами на навісі та підсвіченою зеленню', 1200, 900);
const tree = photo('garden-tree', 'Висока ялинка з теплими вогнями посеред вечірнього саду', 1200, 900);
const path = photo('tree-path', 'Садова доріжка між деревами зі світловими нитками на стовбурах', 1200, 900);
const terrace = photo('terrace', 'Ретрогірлянди над садовою терасою');

export const portfolioGalleries: readonly PortfolioGallery[] = [
  {
    id: 'zamiski-budynky',
    title: 'Заміські будинки',
    description: 'Контурне світло, карнизи та вхідні групи.',
    cover: cottage,
    works: [
      {
        id: 'house', title: 'Заміський будинок',
        detail: 'Теплий контур карнизів і м’який акцент над входом.',
        media: {kind: 'photo', preview: cottage},
      },
      {
        id: 'stone-house', title: 'Будинок із кам’яним фасадом',
        detail: 'Гірлянди підкреслюють гострі фронтони та вхід до будинку.',
        media: {kind: 'photo', preview: stoneHouse},
      },
      {
        id: 'stone-house-video', title: 'Фасад і вхід у вечірньому світлі',
        detail: 'Відеоогляд світлового контуру кам’яного будинку.',
        media: {kind: 'video', preview: stoneHouse, src: '/media/hero.webm'},
      },
    ],
  },
  {
    id: 'komertsiini-obiekty',
    title: 'Комерційні об’єкти',
    description: 'Світло для вітрин, фасадів і входів.',
    cover: cafe,
    works: [
      {
        id: 'cafe', title: 'Міське кафе',
        detail: 'Світлова завіса над вітриною та м’яке світло біля входу.',
        media: {kind: 'photo', preview: cafe},
      },
      {
        id: 'hotel', title: 'Вхід до готелю',
        detail: 'Тепла бахрома вздовж навісу та вогні серед зелені біля дверей.',
        media: {kind: 'photo', preview: hotel},
      },
      {
        id: 'cafe-video', title: 'Вітрина кафе у сутінках',
        detail: 'Відеоогляд підсвіченої вітрини з боку вулиці.',
        media: {kind: 'video', preview: cafe, src: '/media/portfolio-cafe.webm'},
      },
    ],
  },
  {
    id: 'prostory-dereva-yalynky',
    title: 'Простори, дерева й ялинки',
    description: 'Гірлянди для садів, терас і святкових ялинок.',
    cover: tree,
    works: [
      {
        id: 'garden-tree', title: 'Святкова ялинка в саду',
        detail: 'Теплі вогні рівномірно підкреслюють гілки живої ялинки.',
        media: {kind: 'photo', preview: tree},
      },
      {
        id: 'tree-path', title: 'Садова алея',
        detail: 'Світлові нитки на стовбурах і гілках ведуть уздовж доріжки.',
        media: {kind: 'photo', preview: path},
      },
      {
        id: 'terrace', title: 'Тераса в саду',
        detail: 'Ретрогірлянди з м’яким світлом над зоною відпочинку.',
        media: {kind: 'video', preview: terrace, src: '/media/portfolio-terrace.webm'},
      },
    ],
  },
];
