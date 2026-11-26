export interface Subcategory {
  readonly id: string;
  readonly name: string;
}

export interface Category {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly description?: string;
  readonly children: readonly Subcategory[];
  readonly photo: string;
}

const OUTDOORS = { id: 'vulychni', name: 'Вуличні' };
const INDOORS = { id: 'interierni', name: 'Інтер’єрні' };

export const CATEGORIES: readonly Category[] = [
  {
    id: 'bakhroma',
    label: 'Бахрома',
    name: 'Гірлянди бахрома',
    children: [OUTDOORS],
    photo: 'products/bakhroma-150-warm-white',
  },
  {
    id: 'nytka',
    label: 'Нитка',
    name: 'Гірлянди нитки',
    children: [OUTDOORS, INDOORS],
    photo: 'products/promin-100-warm-black',
  },
  {
    id: 'shtora',
    label: 'Штора',
    name: 'Гірлянди штори',
    children: [OUTDOORS, INDOORS],
    photo: 'products/zavisa-456-warm',
  },
  {
    id: 'sitka',
    label: 'Сітка',
    name: 'Гірлянди сітки',
    children: [OUTDOORS, INDOORS],
    photo: 'products/sitka-288-studio',
  },
  {
    id: 'kulky',
    label: 'Кульки',
    name: 'Гірлянди з кульками',
    children: [OUTDOORS, INDOORS],
    photo: 'products/sfera-20-warm',
  },
  {
    id: 'padayuchyi-snih',
    label: 'Падаючий сніг',
    name: 'Гірлянди «Падаючий сніг»',
    description: 'Вуличні гірлянди з білими світловими підвісами для дерев і карнизів.',
    children: [OUTDOORS],
    photo: 'products/snowfall-50',
  },
  {
    id: 'fihury',
    label: 'Фігури і мотиви',
    name: 'Світлові фігури і мотиви',
    children: [
      { id: 'zirky', name: 'Зірки' },
      { id: 'snizhynky', name: 'Сніжинки' },
    ],
    photo: 'products/snizhynka',
  },
  { id: 'retro', label: 'Ретрогірлянди', name: 'Ретрогірлянди', children: [OUTDOORS, INDOORS], photo: 'terrace' },
  {
    id: 'yalynky',
    label: 'LED-ялинки',
    name: 'LED-ялинки',
    children: [{ id: 'spiralni', name: 'Спіральні' }],
    photo: 'products/spiral-rgb',
  },
  {
    id: 'aksesuary',
    label: 'Аксесуари',
    name: 'Аксесуари для гірлянд',
    children: [
      { id: 'zhyvlennia', name: 'Живлення' },
      { id: 'kriplennia', name: 'Кріплення' },
    ],
    photo: 'hero',
  },
];
