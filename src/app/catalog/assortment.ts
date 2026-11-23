import { Glow, glowOptions, Product, ProductMedia, Variant, Wire } from './products';

function media(name: string, alt: string, kind: ProductMedia['kind'] = 'series'): ProductMedia {
  return {file: '/media/products/' + name + '.webp', alt, kind};
}

function variant(sku: string, glow: Glow | null, wire: Wire | null, size: string, ...gallery: ProductMedia[]): Variant {
  return {sku, glow, wire, size, gallery, priceKopiykas: null, availability: 'unknown'};
}

function connectorPhotos(wire: Wire): readonly ProductMedia[] {
  const cable = wire === 'white' ? 'білому' : 'чорному';
  const file = 'bakhroma-150-connector-' + wire;
  return [
    media(file + '-cap', 'Роз’єм із захисним ковпачком на ' + cable + ' проводі', 'variant'),
    media(file + '-joined', 'З’єднані роз’єми на ' + cable + ' проводі', 'variant'),
  ];
}

const reference = media('led-reference', 'Один світлодіод теплого кольору, білий провід і біла термоусадка', 'reference');

function miniLedVariants(model: string, prefix: string, size: string): Product['variants'] {
  const warm = 'Світлодіод теплого білого кольору на чорному проводі з чорною термоусадкою';
  const white = 'Світлодіод білого кольору на чорному проводі з чорною термоусадкою';
  return [
    variant(prefix + '-WW-BK', 'warm', 'black', size, media(model + '-warm-led', warm, 'variant')),
    variant(prefix + '-WH-BK', 'white', 'black', size, media(model + '-white-led', white, 'variant')),
    variant(prefix + '-WW-WH', 'warm', 'white', size, reference),
    variant(prefix + '-WH-WH', 'white', 'white', size),
  ];
}

const icicleWarm = media('kontur-90-warm', 'Гірлянда-бахрома, тепле біле світіння');
const icicleCool = media('kontur-90-cool', 'Гірлянда-бахрома, холодне біле світіння');
const curtainWarm = media('zavisa-456-warm', 'Тепло-біла гірлянда-штора на білому проводі', 'variant');
const galaxyWarm = media('sfera-20-warm', 'Прозора куля з теплим білим світінням');
const galaxyCool = media('sfera-20-cool', 'Прозора куля з холодним білим світінням');
const net: ProductMedia = {
  ...media('sitka-288-studio', 'Біла світлодіодна сітка крупним планом', 'variant'),
  note: 'Ілюстрація сітки.',
};
const netGarden: ProductMedia = {
  ...media('sitka-288-garden', 'Біла гірлянда-сітка на кущі', 'application'),
  note: 'Ілюстрація використання.',
};
const netDiagram = media('sitka-288-diagram', 'Схема сітки 2 × 1,5 м', 'application');
const filamentGallery = [
  media('retro-s14', 'Ряд ламп S14 із теплим білим світінням на чорному проводі'),
  media('retro-s14-detail', 'Світлодіодна нитка всередині прозорої лампи S14 крупним планом'),
  media('retro-s14-wide', 'Підвісні лампи S14 на чорному проводі, вигляд спереду'),
  media('retro-s14-side', 'Тепло-білі лампи S14 збоку, передня лампа у фокусі'),
  {
    ...media('retro-s14-terrace', 'Ретрогірлянда Belt light S14 освітлює вечірню терасу кафе', 'application'),
    note: 'Ілюстрація використання гірлянди на терасі.',
  },
];
const tree = media('spiral-rgb', 'Ялинка Magic Spiral з білою зіркою та червоно-фіолетовим і синім світінням', 'variant');
const treeGreen = media('spiral-rgb-green', 'Ялинка Magic Spiral з переходом від блакитного до зеленого й помаранчевого', 'variant');
const treeRainbow = media('spiral-rgb-rainbow', 'Ялинка Magic Spiral з білою зіркою та райдужним світінням', 'variant');
const treeIllustration: ProductMedia = {
  ...media('spiral-series-composite', 'Неонова ялинка Magic Spiral на терасі, світлова стрічка крупним планом, смартфон і пульт', 'application'),
  note: 'Ілюстрація серії Magic Spiral.',
};

const icicleSize = '3\u00a0×\u00a00,5\u00a0м';
const icicleSpecifications = [
  {label: 'Застосування', value: 'Вуличне'},
  {label: 'Джерело світла', value: 'Світлодіоди (LED)'},
  {label: 'Кількість світлодіодів', value: '150 LED'},
  {label: 'Напруга', value: '220 В'},
  {label: 'З’єднання секцій', value: 'До 10 гірлянд'},
  {label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили'},
  {label: 'Потужність', value: '11 Вт'},
  {label: 'Заявлений строк служби', value: 'Необмежений'},
] as const;

const icicleColors = {
  warm: ['WW', 'Тепле біле'],
  cool: ['CW', 'Холодне біле'],
  red: ['RD', 'Червоне'],
  yellow: ['YL', 'Жовте'],
  blue: ['BL', 'Синє'],
} as const;

function icicleVariant(glow: keyof typeof icicleColors, wire: Wire, flashing: boolean): Variant {
  const [hue, color] = icicleColors[glow];
  const cable = wire === 'white' ? 'білому' : 'чорному';
  const file = 'bakhroma-150-' + glow + '-' + wire;
  const alt = color + ' світіння бахроми на ' + cable + ' каучуковому проводі';
  const modeFile = flashing ? file + '-flash' : file;
  const modeAlt = flashing ? alt + ' з холодно-білим мерехтінням' : alt;
  const photo = media(modeFile, modeAlt, 'variant');
  const gallery = glow === 'warm' || glow === 'cool' ? [
    photo,
    media(file + '-detail', 'Крупний план світлодіодів на ' + cable + ' проводі. ' + color + ' світіння.', 'variant'),
  ] : [{...photo, note: 'Ілюстрація кольору світіння.'}];
  const prefix = flashing ? 'GY-B150-F' : 'GY-B150';
  const wireCode = wire === 'white' ? 'WH' : 'BK';
  return variant(prefix + '-' + hue + '-' + wireCode, glow, wire, icicleSize, ...gallery, ...connectorPhotos(wire));
}

function icicleVariants(flashing: boolean): Product['variants'] {
  const extraColors = ['red', 'yellow', 'blue'] as const;
  return [
    icicleVariant('warm', 'white', flashing),
    icicleVariant('cool', 'white', flashing),
    icicleVariant('warm', 'black', flashing),
    icicleVariant('cool', 'black', flashing),
    ...(!flashing ? extraColors.flatMap(glow => [
      icicleVariant(glow, 'white', false), icicleVariant(glow, 'black', false),
    ]) : []),
  ];
}

const strandSize = '10\u00a0м';
const strandSpecifications = [
  {label: 'Застосування', value: 'Вуличне'},
  {label: 'Джерело світла', value: 'Світлодіоди (LED)'},
  {label: 'Кількість світлодіодів', value: '100 LED'},
  {label: 'Крок між світлодіодами', value: '10 см'},
  {label: 'Напруга', value: '220 В'},
  {label: 'З’єднання секцій', value: 'До 10 гірлянд'},
  {label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили'},
  {label: 'Потужність', value: '10 Вт'},
  {label: 'Заявлений строк служби', value: 'Необмежений'},
] as const;

const strandWhites = [
  {glow: 'warm', code: 'WW'},
  {glow: 'white', code: 'WH'},
] as const;

const strandGlows = [
  ...strandWhites,
  {glow: 'orange', code: 'OR'},
  {glow: 'red', code: 'RD'},
  {glow: 'yellow', code: 'YL'},
  {glow: 'blue', code: 'BL'},
  {glow: 'green', code: 'GN'},
  {glow: 'rgb', code: 'RGB'},
] as const;

const strandWarmFlashApplications = [
  media('promin-100-installation-warm-flash', 'Тепло-білі гірлянди-нитки з холодно-білими спалахами на фасаді торгового центру', 'application'),
  media('promin-100-installation-fir-flash', 'Тепло-білі гірлянди-нитки з холодно-білими спалахами на засніженій ялинці', 'application'),
];

const strandApplications: Partial<Record<Glow, readonly ProductMedia[]>> = {
  warm: [
    {
      file: '/media/tree-path.webp',
      alt: 'Тепло-білі гірлянди-нитки на стовбурах і гілках дерев уздовж садової доріжки',
      kind: 'application',
    },
    media('promin-100-installation-fir', 'Тепло-біла гірлянда-нитка на засніженій ялинці', 'application'),
  ],
  white: [
    media('promin-100-installation-facade', 'Холодно-білі гірлянди-нитки на стовбурі та гілках дерева біля будинку', 'application'),
  ],
};

const strandColorApplication: ProductMedia = {
  file: '/media/color-alley.webp',
  alt: 'Садова алея з деревами, підсвіченими гірляндами-нитками різних кольорів',
  kind: 'application',
};

function strandVariant({glow, code}: typeof strandGlows[number], wire: Wire, flashing: boolean): Variant {
  const cable = wire === 'white' ? 'білому' : 'чорному';
  const label = glowOptions[glow].label;
  const mode = flashing ? '-flash' : '';
  const file = 'promin-100-' + glow + '-' + wire + mode;
  const alt = 'Гірлянда-нитка на ' + cable + ' каучуковому проводі. ' + label;
  const photo = media(file, flashing ? alt + ' з холодно-білим мерехтінням' : alt, 'variant');
  const detail = media('promin-100-detail-' + wire, 'Вимкнені світлодіоди на ' + cable + ' проводі', 'variant');
  const applications = flashing && glow === 'warm'
    ? strandWarmFlashApplications
    : strandApplications[glow] ?? [strandColorApplication];
  const prefix = flashing ? 'GY-P100-F-' : 'GY-P100-';
  const wireCode = wire === 'white' ? 'WH' : 'BK';
  return variant(prefix + code + '-' + wireCode, glow, wire, strandSize, photo, detail, ...applications, ...connectorPhotos(wire));
}

function strandVariants(flashing: boolean): Product['variants'] {
  const [warm, ...remaining] = flashing ? strandWhites : strandGlows;
  const pair = (color: typeof strandGlows[number]): readonly [Variant, Variant] => [
    strandVariant(color, 'black', flashing),
    strandVariant(color, 'white', flashing),
  ];
  return [...pair(warm), ...remaining.flatMap(pair)];
}

const curtainSize = '2 × 1,5 м';
const curtainDropPitch = {label: 'Крок між вертикальними нитками', value: '8 см'};

type CurtainWirePhotos = Readonly<Record<Wire, ProductMedia>>;

function curtainWirePhotos(file: string, alt: string, originalWire: Wire, kind: ProductMedia['kind'] = 'series'): CurtainWirePhotos {
  return {
    white: media(originalWire === 'white' ? file : file + '-white', alt + '. Білий провід', kind),
    black: media(originalWire === 'black' ? file : file + '-black', alt + '. Чорний провід', kind),
  };
}

const curtainDetails = [
  curtainWirePhotos('zavisa-456-unlit-led', 'Вимкнений світлодіод із прозорим ковпачком', 'black'),
  curtainWirePhotos('zavisa-456-t-junction', 'Т-подібний вузол кріплення вертикальної нитки до горизонтального проводу', 'black'),
];
const curtain456Installations = {
  warm: curtainWirePhotos('zavisa-456-warm-terrace', 'Візуалізація монтажу тепло-білої штори на терасі', 'white', 'application'),
  cool: curtainWirePhotos('zavisa-456-cool-facade', 'Візуалізація монтажу холодно-білої штори на фасаді', 'white', 'application'),
};
const curtainColors = [
  {glow: 'yellow', code: 'YL'},
  {glow: 'green', code: 'GN'},
  {glow: 'red', code: 'RD'},
  {glow: 'blue', code: 'BL'},
] as const;

function curtainVariants(ledCount: number, size: string, installations: Readonly<Record<'warm' | 'cool', CurtainWirePhotos>>): Product['variants'] {
  const supportingPhotos: Partial<Record<Glow, readonly CurtainWirePhotos[]>> = {
    warm: [installations.warm],
    cool: [
      curtainWirePhotos('zavisa-456-cool-strands', 'Паралельні нитки штори з холодно-білими світлодіодами', 'black'),
      installations.cool,
      curtainWirePhotos('zavisa-456-cool-leds', 'Крупний план холодно-білих світлодіодів і скручених жил', 'black'),
    ],
  };
  const makeVariant = (glow: Glow, code: string, wire: Wire): Variant => {
    const cable = wire === 'white' ? 'білому' : 'чорному';
    const wireCode = wire === 'white' ? 'WH' : 'BK';
    const photo = glow === 'warm' && wire === 'white' ? curtainWarm : media(
      'zavisa-456-' + glow + '-' + wire,
      'Гірлянда-штора на ' + cable + ' проводі. Колір світіння — ' + glowOptions[glow].label.toLowerCase(),
      'variant',
    );
    const details = [...(supportingPhotos[glow] ?? []), ...curtainDetails].map(photos => photos[wire]);
    return variant('GY-Z' + ledCount + '-' + code + '-' + wireCode, glow, wire, size, photo, ...details);
  };
  return [
    makeVariant('warm', 'WW', 'white'), makeVariant('cool', 'CW', 'white'),
    makeVariant('warm', 'WW', 'black'), makeVariant('cool', 'CW', 'black'),
    ...curtainColors.flatMap(({glow, code}) => [makeVariant(glow, code, 'white'), makeVariant(glow, code, 'black')]),
  ];
}

function curtainModel(ledCount: number, size: string, drops: number, locations: string): Product {
  const slug = 'zavisa-' + ledCount;
  const installations = {
    warm: curtainWirePhotos(slug + '-installation-warm', 'Тепло-біла гірлянда-штора ' + size + ' на вітрині', 'white', 'application'),
    cool: curtainWirePhotos(slug + '-installation-cool', 'Холодно-біла гірлянда-штора ' + size + ' на вітрині', 'white', 'application'),
  };
  return {
    slug,
    name: 'Гірлянда-штора ' + size.replace(' × ', 'х'),
    category: 'shtora', subcategories: ['vulychni'], featured: false,
    cover: installations.warm.white,
    description: 'Вулична гірлянда-штора для ' + locations + '. Вертикальні нитки однакової довжини утворюють рівний нижній край.',
    specifications: [
      {label: 'Застосування', value: 'Вуличне'},
      {label: 'Джерело світла', value: 'Світлодіоди (LED)'},
      {label: 'Кількість світлодіодів', value: ledCount + ' LED'},
      {label: 'Кількість вертикальних ниток', value: String(drops)},
      curtainDropPitch,
      {label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили'},
    ],
    variants: curtainVariants(ledCount, size, installations),
  };
}

function snowflakeMotif(
  slug: string, sku: string, size: string, glow: 'blue' | 'cool', mode: 'static' | 'flicker',
  file = slug, shape = '',
): Product {
  const name = 'Мотив сніжинка ' + size;
  const color = glowOptions[glow].label;
  const modeLabel = mode === 'static' ? 'статичний' : 'мерехтіння';
  const light = glow === 'blue' ? 'синім світлом' : 'холодним білим світлом';
  const photo = media(file, name + '. Світиться ' + light + '.', 'variant');
  const effect = mode === 'static' ? ' у статичному режимі' : ' з білим мерехтінням';
  const outline = shape ? ' Має ' + shape.toLowerCase() + '.' : '';
  return {
    slug, name, category: 'fihury', subcategories: ['snizhynky'], featured: false,
    cardSubtitle: color + ' · ' + modeLabel + (shape ? ' · ' + shape.toLowerCase() : ''),
    cover: photo,
    description: 'Вулична світлодіодна сніжинка для фасадів і вітрин. Світиться ' + light + effect + '.' + outline,
    specifications: [
      {label: 'Тип гірлянди', value: 'Сніжинка'},
      {label: 'Режим роботи', value: modeLabel + ' (' + mode + ')'},
      {label: 'Призначення', value: 'Зовнішнє використання'},
      {label: 'Силовий кабель', value: 'Присутній'},
      {label: 'Напруга', value: '230 В'},
      {label: 'Клас захисту', value: 'IP44'},
    ],
    variants: [variant(sku, glow, 'black', size, photo)],
  };
}

const snowflake40Cool = snowflakeMotif('snizhynka-40x40-cool-flicker', 'GY-SNOW40-CW', '40 × 40 см', 'cool', 'flicker');
const snowflake60Cool = snowflakeMotif('snizhynka-60x60-cool-flicker', 'GY-SNOW60-CW', '60 × 60 см', 'cool', 'flicker');

// Keep the former shared URL and its two SKU selections usable for saved links.
export const legacySnowflake: Product = {
  ...snowflake40Cool,
  slug: 'snizhynka', name: 'Мотив сніжинка',
  variants: [snowflake40Cool.variants[0], snowflake60Cool.variants[0]],
};

function unavailable([first, ...rest]: Product['variants']): Product['variants'] {
  const mark = (item: Variant): Variant => ({...item, availability: 'unavailable'});
  return [mark(first), ...rest.map(mark)];
}

// Retain the exact products referenced by existing carts and direct product links.
export const archivedIcicles: readonly Product[] = [
  {
    slug: 'kontur-114', name: 'Гірлянда-бахрома «Контур 114»',
    category: 'bakhroma', subcategories: ['vulychni'], featured: false,
    description: 'Для карнизів і балконів. Дві секції по 1,5 м, статичне світіння, IP65. Кабель живлення купується окремо.',
    variants: unavailable(miniLedVariants('kontur-114', 'GY-K114', '3 × 0,5 м')),
  },
  {
    slug: 'kontur-90', name: 'Гірлянда-бахрома «Контур 90»',
    category: 'bakhroma', subcategories: ['vulychni'], featured: false,
    cover: icicleWarm, description: 'Компактна бахрома 2 × 0,5 м зі статичним світінням для коротких карнизів і вхідних груп.',
    variants: unavailable([
      variant('GY-K090-WW-BK', 'warm', 'black', '2 × 0,5 м', icicleWarm),
      variant('GY-K090-CW-BK', 'cool', 'black', '2 × 0,5 м', icicleCool),
      variant('GY-K090-WW-WH', 'warm', 'white', '2 × 0,5 м', icicleWarm),
      variant('GY-K090-CW-WH', 'cool', 'white', '2 × 0,5 м', icicleCool),
    ]),
  },
];

export const assortment: readonly Product[] = [
  {
    slug: 'bakhroma-150', name: 'Гірлянда-бахрома ' + icicleSize,
    category: 'bakhroma', subcategories: ['vulychni'], featured: true,
    description: 'Вулична бахрома зі 150 світлодіодами для карнизів, фасадів і входів. Стале світіння, білий або чорний каучуковий провід.',
    specifications: [...icicleSpecifications, {label: 'Режим світіння', value: 'Стале світіння'}],
    variants: icicleVariants(false),
  },
  {
    slug: 'bakhroma-150-merekhtinnia', name: 'Гірлянда-бахрома ' + icicleSize + ' з мерехтінням',
    category: 'bakhroma', subcategories: ['vulychni'], featured: false,
    description: 'Вулична бахрома зі 150 світлодіодами. Оберіть тепле або холодне біле основне світіння. Окремі світлодіоди мерехтять холодним білим.',
    specifications: [...icicleSpecifications, {label: 'Колір мерехтіння', value: 'Холодний білий'}],
    variants: icicleVariants(true),
  },
  {
    slug: 'promin-100', name: 'Гірлянда-нитка ' + strandSize,
    category: 'nytka', subcategories: ['vulychni'], featured: true,
    description: 'Вулична нитка зі 100 світлодіодами для дерев, перил і терас. Вісім варіантів сталого світіння, білий або чорний каучуковий провід.',
    specifications: [...strandSpecifications, {label: 'Режим світіння', value: 'Стале світіння'}],
    variants: strandVariants(false),
  },
  {
    slug: 'promin-100-merekhtinnia', name: 'Гірлянда-нитка ' + strandSize + ' з мерехтінням',
    category: 'nytka', subcategories: ['vulychni'], featured: false,
    description: 'Вулична нитка зі 100 світлодіодами на білому або чорному каучуковому проводі. У білій версії основне світіння та яскравіші спалахи мають однаковий холодно-білий відтінок. У тепло-білій версії окремі діоди спалахують холодним білим.',
    specifications: [...strandSpecifications, {label: 'Колір мерехтіння', value: 'Холодний білий'}],
    variants: strandVariants(true),
  },
  {
    slug: 'zavisa-456', name: 'Гірлянда-штора 2х1,5 м',
    category: 'shtora', subcategories: ['vulychni'], featured: true,
    cover: curtainWarm,
    description: 'Вулична гірлянда-штора з 456 світлодіодами для фасадів, вітрин і терас. Вертикальні нитки однакової довжини утворюють рівний нижній край.',
    specifications: [
      {label: 'Застосування', value: 'Вуличне'},
      {label: 'Джерело світла', value: 'Світлодіоди (LED)'},
      {label: 'Кількість світлодіодів', value: '456 LED'},
      {label: 'Кількість вертикальних ниток', value: '24'},
      curtainDropPitch,
      {label: 'Напруга', value: '220 В'},
      {label: 'З’єднання секцій', value: 'До 5 гірлянд'},
      {label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили'},
      {label: 'Заявлений строк служби', value: 'Необмежений'},
    ],
    variants: curtainVariants(456, curtainSize, curtain456Installations),
  },
  curtainModel(912, '2 × 3 м', 24, 'високих вітрин і входів'),
  curtainModel(288, '1,5 × 1 м', 18, 'вікон і невеликих вітрин'),
  {
    slug: 'sitka-288', name: 'Гірлянда-сітка 2 × 1,5 м',
    category: 'sitka', subcategories: ['vulychni'], featured: false,
    description: 'Вулична сітка з 288 світлодіодами для рівномірної підсвітки кущів, живоплотів і фасадів.',
    specifications: [
      {label: 'Застосування', value: 'Вуличне'},
      {label: 'Джерело світла', value: 'Світлодіоди (LED)'},
      {label: 'Кількість світлодіодів', value: '288 LED'},
      {label: 'Режим світіння', value: 'Стале світіння'},
      {label: 'Напруга', value: '220 В'},
      {label: 'З’єднання секцій', value: 'До 8 гірлянд'},
      {label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили'},
      {label: 'Потужність', value: '24 Вт'},
    ],
    variants: [variant('GY-NET288-WH', 'white', 'black', '2 × 1,5 м', net, netGarden, netDiagram)],
  },
  {
    slug: 'sfera-20', name: 'Гірлянда з кульками «Сфера 20»',
    category: 'kulky', subcategories: ['vulychni'], featured: false,
    cover: galaxyWarm, description: '20 прозорих кульок на кабелі 10 м. Відстань між лампами 50 см.',
    variants: [
      variant('GY-S020-WW', 'warm', 'black', '10 м', galaxyWarm),
      variant('GY-S020-CW', 'cool', 'black', '10 м', galaxyCool),
    ],
  },
  snowflakeMotif('snizhynka-30x25-5-cool-flicker', 'GY-SNOW30X255-F-CW', '30 × 25,5 см', 'cool', 'flicker'),
  snowflakeMotif('snizhynka-40x40-blue', 'GY-SNOW40-BL', '40 × 40 см', 'blue', 'static'),
  snowflakeMotif('snizhynka-40x40-blue-flicker', 'GY-SNOW40-F-BL', '40 × 40 см', 'blue', 'flicker'),
  snowflake40Cool,
  snowflakeMotif('snizhynka-49-5x42-blue', 'GY-SNOW495X42-BL', '49,5 × 42 см', 'blue', 'static', 'snizhynka-blue-diamonds'),
  snowflakeMotif('snizhynka-49-5x42-cool', 'GY-SNOW495X42-CW', '49,5 × 42 см', 'cool', 'static'),
  snowflakeMotif('snizhynka-60x60-blue', 'GY-SNOW60-BL', '60 × 60 см', 'blue', 'static'),
  snowflake60Cool,
  snowflakeMotif('snizhynka-60x60-cool-branches', 'GY-SNOW60-F-CW-BR', '60 × 60 см', 'cool', 'flicker',
    'snizhynka-60x60-cool-branches', 'Розгалужені промені'),
  snowflakeMotif('snizhynka-60-5x52-blue', 'GY-SNOW605X52-BL', '60,5 × 52 см', 'blue', 'static', 'snizhynka-blue-diamonds'),
  {
    slug: 'retro-s14', name: 'Ретрогірлянда Belt light S14',
    category: 'retro', subcategories: ['vulychni'], featured: true,
    description: 'Вулична ретрогірлянда для терас, альтанок і літніх майданчиків. Прозорі світлодіодні лампи S14 на чорному проводі дають рівне тепле біле світло.',
    specifications: [
      {label: 'Тип гірлянди', value: 'Belt light'},
      {label: 'Крок між лампами', value: '20 см'},
      {label: 'Режим світіння', value: 'Стале світіння'},
      {label: 'Призначення', value: 'Зовнішнє використання'},
      {label: 'Силовий кабель', value: 'Відсутній у комплекті'},
      {label: 'Напруга', value: '230 В'},
      {label: 'Клас захисту', value: 'IP44'},
    ],
    variants: [
      {...variant('GY-S14-2-WW', 'warm', 'black', '2 м', ...filamentGallery), lampCount: 10},
      {...variant('GY-S14-4-WW', 'warm', 'black', '4 м', ...filamentGallery), lampCount: 20},
    ],
  },
  {
    slug: 'spiral', name: 'LED-ялинка Magic Spiral 1,2 м',
    category: 'yalynky', subcategories: ['spiralni'], featured: false,
    cover: tree,
    description: 'Світлова ялинка для двору, тераси чи входу. Під’єднайте її до мережі 230 В. Колір, яскравість і режим світіння можна налаштувати пультом із комплекту або через застосунок, встановлений на смартфон. Спіраль плавно переливається або мерехтить, а зірка світиться білим.',
    specifications: [
      {label: 'Тип гірлянди', value: '3D-мотив'},
      {label: 'Режим роботи', value: 'Повне мерехтіння (all flicker)'},
      {label: 'Призначення', value: 'Зовнішнє використання'},
      {label: 'Силовий кабель', value: 'Присутній'},
      {label: 'Напруга', value: '230 В'},
      {label: 'Клас захисту', value: 'IP44'},
    ],
    variants: [variant('GY-SPIRAL120-RGB', 'rgb', null, '1,2 м', tree, treeGreen, treeRainbow, treeIllustration)],
  },
  {
    slug: 'kabel-zhyvlennia-3a', name: 'Кабель живлення 3 А',
    category: 'aksesuary', subcategories: ['zhyvlennia'], featured: false,
    description: 'Кабель 1,5 м, IP65. Підходить до гірлянди-нитки 10 м зі сталим світінням і «Контура 114».',
    variants: [
      variant('GY-P3A-BK', null, 'black', '1,5 м'),
      variant('GY-P3A-WH', null, 'white', '1,5 м'),
    ],
  },
];
