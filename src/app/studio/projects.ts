export interface PortfolioImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface PortfolioWork {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly location?: string;
  readonly image: PortfolioImage;
}

interface PortfolioGallery {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly works: readonly PortfolioWork[];
}

function galleryPhoto(id: string, title: string, detail: string, width: number, height: number): PortfolioWork {
  return { id, title, detail, image: { src: '/media/works/' + id + '.webp', alt: detail, width, height } };
}

export const PORTFOLIO_GALLERIES: readonly PortfolioGallery[] = [
  {
    id: 'zamiski-budynky',
    title: 'Заміські будинки',
    description: 'Контурне світло, карнизи та вхідні групи.',
    works: [
      galleryPhoto(
        'house-white-lights',
        'Будинок із білими гірляндами',
        'Біла бахрома вздовж карнизів і світлові олені на подвір’ї.',
        1728,
        910,
      ),
      galleryPhoto(
        'house-roof-and-conifers',
        'Білі гірлянди на даху й хвойних деревах',
        'Бічний вид будинку з білою бахромою під дахом і вогнями на хвойних деревах.',
        1672,
        941,
      ),
      galleryPhoto(
        'house-entrance-deer',
        'Світлові олені біля входу',
        'Білі олені перед входом під підсвіченим карнизом.',
        1122,
        1402,
      ),
      galleryPhoto(
        'house-golden-deer',
        'Будинок із золотистими оленями',
        'Дві світлові фігури на газоні та біла бахрома вздовж даху.',
        1672,
        941,
      ),
      galleryPhoto(
        'brick-house-blue',
        'Цегляний будинок із синіми гірляндами',
        'Сині вогні вздовж карнизів і на деревах біля фасаду.',
        1672,
        941,
      ),
      galleryPhoto(
        'house-water-reflection',
        'Будинок біля води',
        'Вогні будинку й берега віддзеркалюються у воді.',
        1254,
        1254,
      ),
    ],
  },
  {
    id: 'komertsiini-obiekty',
    title: 'Комерційні об’єкти',
    description: 'Світло для вітрин, фасадів і входів.',
    works: [
      galleryPhoto(
        'bossanova-entrance',
        'Вхід до BOSSANOVA',
        'Теплі гірлянди під козирком над входом і вітринами.',
        1672,
        941,
      ),
      galleryPhoto(
        'bossanova-canopy',
        'Козирок BOSSANOVA',
        'Тепла світлова бахрома під вивіскою крупним планом.',
        1731,
        909,
      ),
      galleryPhoto('hotel-time', 'Фасад Hotel Time', 'Сині гірлянди окреслюють карнизи фасаду готелю.', 1672, 941),
      galleryPhoto(
        'terminal-food-snow',
        'Terminal Food під час снігопаду',
        'Загальний вид фасаду з теплими гірляндами вздовж даху.',
        1672,
        941,
      ),
      galleryPhoto(
        'terminal-food-lion',
        'Скульптура лева біля Terminal Food',
        'Лев біля фасаду зі світловим контуром карниза.',
        941,
        1672,
      ),
      galleryPhoto(
        'republic-eaves',
        'Світловий карниз REPUBLIC',
        'Тепла бахрома під карнизом над вивіскою REPUBLIC.',
        1672,
        941,
      ),
      galleryPhoto(
        'pashtet-entrance',
        'Вхід до «Паштету»',
        'Теплі гірлянди над входом і на колонах закладу.',
        1655,
        950,
      ),
      galleryPhoto(
        'pashtet-facade',
        'Кутовий фасад «Паштету»',
        'Тепла бахрома огортає кут фасаду й підсвічує колони.',
        1672,
        941,
      ),
      galleryPhoto(
        'chalet-terrace',
        'Фасад і тераса шале',
        'Теплі гірлянди підкреслюють фронтони та відкриту терасу.',
        1740,
        904,
      ),
      galleryPhoto(
        'chalet-side',
        'Дах і колони шале',
        'Бічний ракурс із теплими гірляндами на даху та колонах.',
        1670,
        941,
      ),
      galleryPhoto(
        'terrace-light-canopy',
        'Світловий навіс над терасою',
        'Ряди теплих гірлянд утворюють навіс над відкритим майданчиком.',
        1672,
        940,
      ),
      galleryPhoto(
        'terrace-lights-below',
        'Гірлянди над терасою зблизька',
        'Вид знизу на теплі вогні, натягнуті рядами над терасою.',
        1672,
        941,
      ),
      galleryPhoto(
        'interior-light-decor',
        'Світлові композиції в інтер’єрі',
        'Підвісні композиції з білими вогнями на тлі зеленої підсвітки.',
        1122,
        1402,
      ),
      galleryPhoto(
        'storefront-warm-lights',
        'Вітрина з теплими гірляндами',
        'Крупний план теплих вогнів уздовж вітрини.',
        950,
        1655,
      ),
    ],
  },
  {
    id: 'prostory-dereva-yalynky',
    title: 'Простори, дерева й ялинки',
    description: 'Гірлянди для садів, терас і святкових ялинок.',
    works: [
      galleryPhoto(
        'christmas-tree-and-thujas',
        'Ялинка біля дерев’яного будиночка',
        'Різнокольорові вогні на ялинці й теплі гірлянди на туях уздовж доріжки.',
        1672,
        941,
      ),
      galleryPhoto(
        'birch-icicle-lights',
        'Берези в зимовому саду',
        'Світлові бурульки на гілках беріз над засніженим садом.',
        1122,
        1402,
      ),
      galleryPhoto(
        'orkhan-tree',
        'Дерево біля «Орхана»',
        'Білі підвіси на гілках і червоні гірлянди на стовбурі.',
        941,
        1672,
      ),
      galleryPhoto(
        'courtyard-tree',
        'Двір із підсвіченим деревом',
        'Вогні на дереві та фасаді відбиваються на мокрій бруківці.',
        950,
        1655,
      ),
      galleryPhoto(
        'tree-paving-reflection',
        'Дерево з відблисками на бруківці',
        'Теплі гірлянди й білі підвіси віддзеркалюються на мокрій бруківці.',
        950,
        1655,
      ),
      galleryPhoto(
        'tree-trunk-and-branches',
        'Підсвічені стовбур і гілки',
        'Теплі світлові нитки обвивають стовбур, білі підвіси звисають із гілок.',
        950,
        1655,
      ),
    ],
  },
];
