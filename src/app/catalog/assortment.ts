import { GLOW_OPTIONS } from './products.ts';
import type { Glow, Product, ProductMedia, Variant, Wire } from './products.ts';

type RubberWire = 'white' | 'black';

function media(name: string, alt: string, kind: ProductMedia['kind'] = 'series'): ProductMedia {
  return { file: '/media/products/' + name + '.webp', alt, kind };
}

const UAH_PER_USD = 45.0811; // NBU rate for 2026-11-24.

function usdToKopiykas(usd: number): number {
  return Math.round(usd * UAH_PER_USD * 100);
}

function variant(
  sku: string,
  glow: Glow | null,
  wire: Wire | null,
  size: string,
  priceKopiykas: number,
  ...gallery: ProductMedia[]
): Variant {
  return { sku, glow, wire, size, gallery, priceKopiykas, availability: 'available' };
}

function connectorPhotos(wire: RubberWire): readonly ProductMedia[] {
  const cable = wire === 'white' ? 'білому' : 'чорному';
  const file = 'bakhroma-150-connector-' + wire;

  return [
    media(file + '-cap', 'Роз’єм із захисним ковпачком на ' + cable + ' проводі', 'variant'),
    media(file + '-joined', 'З’єднані роз’єми на ' + cable + ' проводі', 'variant'),
  ];
}

const REFERENCE = media(
  'led-reference',
  'Один світлодіод теплого кольору, білий провід і біла термоусадка',
  'reference',
);

function miniLedVariants(model: string, prefix: string, size: string): Product['variants'] {
  const warm = 'Світлодіод теплого білого кольору на чорному проводі з чорною термоусадкою';
  const white = 'Світлодіод білого кольору на чорному проводі з чорною термоусадкою';
  const price = usdToKopiykas(54);

  return [
    variant(prefix + '-WW-BK', 'warm', 'black', size, price, media(model + '-warm-led', warm, 'variant')),
    variant(prefix + '-WH-BK', 'white', 'black', size, price, media(model + '-white-led', white, 'variant')),
    variant(prefix + '-WW-WH', 'warm', 'white', size, price, REFERENCE),
    variant(prefix + '-WH-WH', 'white', 'white', size, price),
  ];
}

const ICICLE_WARM = media('kontur-90-warm', 'Гірлянда бахрома, тепле біле світіння');
const ICICLE_COOL = media('kontur-90-cool', 'Гірлянда бахрома, холодне біле світіння');

const SNOWFALL_PHOTO = media(
  'snowfall-50',
  'Фрагмент гірлянди Snowfall з прозорими підвісами 50 см і білими світлодіодами',
  'illustration',
);

const METEOR_PHOTO = media(
  'meteor-30',
  'Фрагмент гірлянди Meteor з прозорими підвісами 30 см і білими світлодіодами',
  'illustration',
);

function snowfallApplication(image: string, alt: string): ProductMedia {
  return {
    file: '/media/works/' + image + '.webp',
    alt,
    kind: 'application',
    note: 'Візуалізація монтажу кількох комплектів. Підвіси в кадрі показано в різних фазах світіння.',
  };
}

const SNOWFALL_TEN_METRES_ON_TREES = snowfallApplication(
  'snowfall-tree',
  'Підвіси Snowfall 10 м на гілках великого дерева біля будинку',
);

const SNOWFALL_THREE_METRES_ON_TREE = snowfallApplication(
  'snowfall-tree-courtyard',
  'Підвіси Snowfall 3 м на листяному дереві у дворі',
);

const METEOR_ON_TREE = snowfallApplication(
  'snowfall-tree-evergreen',
  'Короткі підвіси Meteor 3 м на хвойному дереві біля кам’яної арки',
);

const SNOWFALL_SPECIFICATIONS = [
  { label: 'Застосування', value: 'Вуличне' },
  { label: 'Джерело світла', value: 'Світлодіоди (LED)' },
  { label: 'Кількість підвісів', value: '10 шт.' },
  { label: 'Напруга', value: '12 В (блок живлення в комплекті)' },
];

const LONG_SNOWFALL_SPECIFICATIONS = [
  ...SNOWFALL_SPECIFICATIONS,
  { label: 'Кількість світлодіодів', value: '720 LED' },
  { label: 'Довжина підвісу', value: '50 см' },
  { label: 'Контролер', value: 'Так' },
];

const CURTAIN_WARM = media('zavisa-456-warm', 'Тепло-біла гірлянда штора на білому проводі', 'variant');
const GALAXY_WARM = media('sfera-20-warm', 'Прозора куля з теплим білим світінням');
const GALAXY_COOL = media('sfera-20-cool', 'Прозора куля з холодним білим світінням');

const NET: ProductMedia = {
  ...media('sitka-288-studio', 'Біла світлодіодна сітка крупним планом', 'variant'),
  note: 'Ілюстрація сітки.',
};

const NET_GARDEN: ProductMedia = {
  ...media('sitka-288-garden', 'Біла гірлянда сітка на кущі', 'application'),
  note: 'Ілюстрація використання.',
};

const NET_DIAGRAM = media('sitka-288-diagram', 'Схема сітки 2 × 1,5 м', 'application');
const COMPACT_NET_DIAGRAM = media('sitka-2x1-diagram', 'Схема сітки 2 × 1 м', 'application');
const NET_DESCRIPTION = 'Вулична сітка з 288 світлодіодами для рівномірної підсвітки кущів, живоплотів і фасадів.';

const NET_SPECIFICATIONS = [
  { label: 'Застосування', value: 'Вуличне' },
  { label: 'Джерело світла', value: 'Світлодіоди (LED)' },
  { label: 'Кількість світлодіодів', value: '288 LED' },
  { label: 'Режим світіння', value: 'Стале світіння' },
  { label: 'Напруга', value: '220 В' },
  { label: 'З’єднання секцій', value: 'До 8 гірлянд' },
  { label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили' },
  { label: 'Потужність', value: '24 Вт' },
];

const FILAMENT_GALLERY = [
  media('retro-s14', 'Ряд ламп S14 із теплим білим світінням на чорному проводі'),
  media('retro-s14-detail', 'Світлодіодна нитка всередині прозорої лампи S14 крупним планом'),
  media('retro-s14-wide', 'Підвісні лампи S14 на чорному проводі, вигляд спереду'),
  media('retro-s14-side', 'Тепло-білі лампи S14 збоку, передня лампа у фокусі'),
  {
    ...media('retro-s14-terrace', 'Ретрогірлянда Belt light S14 освітлює вечірню терасу кафе', 'application'),
    note: 'Ілюстрація використання гірлянди на терасі.',
  },
];

const TREE = media(
  'spiral-rgb',
  'Ялинка Magic Spiral з білою зіркою та червоно-фіолетовим і синім світінням',
  'variant',
);

const TREE_GREEN = media(
  'spiral-rgb-green',
  'Ялинка Magic Spiral з переходом від блакитного до зеленого й помаранчевого',
  'variant',
);

const TREE_RAINBOW = media(
  'spiral-rgb-rainbow',
  'Ялинка Magic Spiral з білою зіркою та райдужним світінням',
  'variant',
);

const TREE_ILLUSTRATION: ProductMedia = {
  ...media(
    'spiral-series-composite',
    'Неонова ялинка Magic Spiral на терасі, світлова стрічка крупним планом, смартфон і пульт',
    'application',
  ),
  note: 'Ілюстрація серії Magic Spiral.',
};

const ICICLE_SIZE = '3\u00a0×\u00a00,5\u00a0м';

const ICICLE_SPECIFICATIONS = [
  { label: 'Застосування', value: 'Вуличне' },
  { label: 'Джерело світла', value: 'Світлодіоди (LED)' },
  { label: 'Кількість світлодіодів', value: '150 LED' },
  { label: 'Напруга', value: '220 В' },
  { label: 'З’єднання секцій', value: 'До 10 гірлянд' },
  { label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили' },
  { label: 'Потужність', value: '11 Вт' },
  { label: 'Заявлений строк служби', value: 'Необмежений' },
] as const;

const ICICLE_COLORS = {
  warm: ['WW', 'Тепле біле'],
  cool: ['CW', 'Холодне біле'],
  red: ['RD', 'Червоне'],
  yellow: ['YL', 'Жовте'],
  blue: ['BL', 'Синє'],
} as const;

function icicleVariant(glow: keyof typeof ICICLE_COLORS, wire: RubberWire, flashing: boolean): Variant {
  const [hue, color] = ICICLE_COLORS[glow];
  const cable = wire === 'white' ? 'білому' : 'чорному';
  const file = 'bakhroma-150-' + glow + '-' + wire;
  const alt = color + ' світіння бахроми на ' + cable + ' каучуковому проводі';
  const modeFile = flashing ? file + '-flash' : file;
  const modeAlt = flashing ? alt + ' з холодно-білим мерехтінням' : alt;
  const photo = media(modeFile, modeAlt, 'variant');

  const gallery =
    glow === 'warm' || glow === 'cool'
      ? [
          photo,
          media(
            file + '-detail',
            'Крупний план світлодіодів на ' + cable + ' проводі. ' + color + ' світіння.',
            'variant',
          ),
        ]
      : [{ ...photo, note: 'Ілюстрація кольору світіння.' }];

  const prefix = flashing ? 'GY-B150-F' : 'GY-B150';
  const wireCode = wire === 'white' ? 'WH' : 'BK';
  const eaves = media(modeFile + '-wood-eaves', 'Бахрома на дерев’яному карнизі вночі. ' + modeAlt + '.', 'variant');
  // BrightLED's 114 LED model has the same dimensions and is the retail price reference.
  const price = usdToKopiykas(flashing ? 60 : 54);

  return variant(
    prefix + '-' + hue + '-' + wireCode,
    glow,
    wire,
    ICICLE_SIZE,
    price,
    ...gallery,
    eaves,
    ...connectorPhotos(wire),
  );
}

function icicleVariants(flashing: boolean): Product['variants'] {
  const extraColors = ['red', 'yellow', 'blue'] as const;

  return [
    icicleVariant('warm', 'white', flashing),
    icicleVariant('cool', 'white', flashing),
    icicleVariant('warm', 'black', flashing),
    icicleVariant('cool', 'black', flashing),
    ...(!flashing
      ? extraColors.flatMap(glow => [icicleVariant(glow, 'white', false), icicleVariant(glow, 'black', false)])
      : []),
  ];
}

const STRAND_SIZE = '10\u00a0м';

const STRAND_SPECIFICATIONS = [
  { label: 'Застосування', value: 'Вуличне' },
  { label: 'Джерело світла', value: 'Світлодіоди (LED)' },
  { label: 'Кількість світлодіодів', value: '100 LED' },
  { label: 'Крок між світлодіодами', value: '10 см' },
  { label: 'Напруга', value: '220 В' },
  { label: 'З’єднання секцій', value: 'До 10 гірлянд' },
  { label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили' },
  { label: 'Потужність', value: '10 Вт' },
  { label: 'Заявлений строк служби', value: 'Необмежений' },
] as const;

const STRAND_WHITES = [
  { glow: 'warm', code: 'WW' },
  { glow: 'white', code: 'WH' },
] as const;

const STRAND_GLOWS = [
  ...STRAND_WHITES,
  { glow: 'orange', code: 'OR' },
  { glow: 'red', code: 'RD' },
  { glow: 'yellow', code: 'YL' },
  { glow: 'blue', code: 'BL' },
  { glow: 'green', code: 'GN' },
  { glow: 'rgb', code: 'RGB' },
] as const;

const STRAND_WARM_FLASH_APPLICATIONS = [
  media(
    'promin-100-installation-warm-flash',
    'Тепло-білі гірлянди нитки з холодно-білими спалахами на фасаді торгового центру',
    'application',
  ),
  media(
    'promin-100-installation-fir-flash',
    'Тепло-білі гірлянди нитки з холодно-білими спалахами на засніженій ялинці',
    'application',
  ),
];

const STRAND_APPLICATIONS: Partial<Record<Glow, readonly ProductMedia[]>> = {
  warm: [
    {
      file: '/media/tree-path.webp',
      alt: 'Тепло-білі гірлянди нитки на стовбурах і гілках дерев уздовж садової доріжки',
      kind: 'application',
    },
    media('promin-100-installation-fir', 'Тепло-біла гірлянда нитка на засніженій ялинці', 'application'),
  ],
  white: [
    media(
      'promin-100-installation-facade',
      'Холодно-білі гірлянди нитки на стовбурі та гілках дерева біля будинку',
      'application',
    ),
  ],
};

const STRAND_COLOR_APPLICATION: ProductMedia = {
  file: '/media/color-alley.webp',
  alt: 'Садова алея з деревами, підсвіченими гірляндами нитками різних кольорів',
  kind: 'application',
};

function strandVariant({ glow, code }: (typeof STRAND_GLOWS)[number], wire: RubberWire, flashing: boolean): Variant {
  const cable = wire === 'white' ? 'білому' : 'чорному';
  const label = GLOW_OPTIONS[glow].label;
  const mode = flashing ? '-flash' : '';
  const file = 'promin-100-' + glow + '-' + wire + mode;
  const alt = 'Гірлянда нитка на ' + cable + ' каучуковому проводі. ' + label;
  const photo = media(file, flashing ? alt + ' з холодно-білим мерехтінням' : alt, 'variant');
  const detail = media('promin-100-detail-' + wire, 'Вимкнені світлодіоди на ' + cable + ' проводі', 'variant');

  const applications =
    flashing && glow === 'warm'
      ? STRAND_WARM_FLASH_APPLICATIONS
      : (STRAND_APPLICATIONS[glow] ?? [STRAND_COLOR_APPLICATION]);

  const prefix = flashing ? 'GY-P100-F-' : 'GY-P100-';
  const wireCode = wire === 'white' ? 'WH' : 'BK';
  const price = usdToKopiykas(flashing ? 45 : 42);

  return variant(
    prefix + code + '-' + wireCode,
    glow,
    wire,
    STRAND_SIZE,
    glow === 'rgb' ? usdToKopiykas(55) : price,
    photo,
    detail,
    ...applications,
    ...connectorPhotos(wire),
  );
}

function strandVariants(flashing: boolean): Product['variants'] {
  const [warm, ...remaining] = flashing ? STRAND_WHITES : STRAND_GLOWS;

  const pair = (color: (typeof STRAND_GLOWS)[number]): readonly [Variant, Variant] => [
    strandVariant(color, 'black', flashing),
    strandVariant(color, 'white', flashing),
  ];

  return [...pair(warm), ...remaining.flatMap(pair)];
}

const CURTAIN_SIZE = '2 × 1,5 м';
const CURTAIN_DROP_PITCH = { label: 'Крок між вертикальними нитками', value: '8 см' };

type CurtainWirePhotos = Readonly<Record<RubberWire, ProductMedia>>;

function curtainWirePhotos(
  file: string,
  alt: string,
  originalWire: RubberWire,
  kind: ProductMedia['kind'] = 'series',
): CurtainWirePhotos {
  return {
    white: media(originalWire === 'white' ? file : file + '-white', alt + '. Білий провід', kind),
    black: media(originalWire === 'black' ? file : file + '-black', alt + '. Чорний провід', kind),
  };
}

const CURTAIN_DETAILS = [
  curtainWirePhotos('zavisa-456-unlit-led', 'Вимкнений світлодіод із прозорим ковпачком', 'black'),
  curtainWirePhotos(
    'zavisa-456-t-junction',
    'Т-подібний вузол кріплення вертикальної нитки до горизонтального проводу',
    'black',
  ),
];

const CURTAIN_456_INSTALLATIONS = {
  warm: curtainWirePhotos(
    'zavisa-456-warm-terrace',
    'Візуалізація монтажу тепло-білої штори на терасі',
    'white',
    'application',
  ),
  cool: curtainWirePhotos(
    'zavisa-456-cool-facade',
    'Візуалізація монтажу холодно-білої штори на фасаді',
    'white',
    'application',
  ),
};

const CURTAIN_COLORS = [
  { glow: 'yellow', code: 'YL' },
  { glow: 'green', code: 'GN' },
  { glow: 'red', code: 'RD' },
  { glow: 'blue', code: 'BL' },
] as const;

function curtainVariants(
  ledCount: number,
  size: string,
  price: number,
  installations: Readonly<Record<'warm' | 'cool', CurtainWirePhotos>>,
): Product['variants'] {
  const supportingPhotos: Partial<Record<Glow, readonly CurtainWirePhotos[]>> = {
    warm: [installations.warm],
    cool: [
      curtainWirePhotos('zavisa-456-cool-strands', 'Паралельні нитки штори з холодно-білими світлодіодами', 'black'),
      installations.cool,
      curtainWirePhotos('zavisa-456-cool-leds', 'Крупний план холодно-білих світлодіодів і скручених жил', 'black'),
    ],
  };

  const makeVariant = (glow: Glow, code: string, wire: RubberWire): Variant => {
    const cable = wire === 'white' ? 'білому' : 'чорному';
    const wireCode = wire === 'white' ? 'WH' : 'BK';

    const photo =
      glow === 'warm' && wire === 'white'
        ? CURTAIN_WARM
        : media(
            'zavisa-456-' + glow + '-' + wire,
            'Гірлянда штора на ' + cable + ' проводі. Колір світіння — ' + GLOW_OPTIONS[glow].label.toLowerCase(),
            'variant',
          );

    const details = [...(supportingPhotos[glow] ?? []), ...CURTAIN_DETAILS].map(photos => photos[wire]);

    return variant('GY-Z' + ledCount + '-' + code + '-' + wireCode, glow, wire, size, price, photo, ...details);
  };

  return [
    makeVariant('warm', 'WW', 'white'),
    makeVariant('cool', 'CW', 'white'),
    makeVariant('warm', 'WW', 'black'),
    makeVariant('cool', 'CW', 'black'),
    ...CURTAIN_COLORS.flatMap(({ glow, code }) => [makeVariant(glow, code, 'white'), makeVariant(glow, code, 'black')]),
  ];
}

function curtainModel(ledCount: number, size: string, drops: number, price: number, locations: string): Product {
  const slug = 'zavisa-' + ledCount;

  const installations = {
    warm: curtainWirePhotos(
      slug + '-installation-warm',
      'Тепло-біла гірлянда штора ' + size + ' на вітрині',
      'white',
      'application',
    ),
    cool: curtainWirePhotos(
      slug + '-installation-cool',
      'Холодно-біла гірлянда штора ' + size + ' на вітрині',
      'white',
      'application',
    ),
  };

  return {
    slug,
    name: 'Гірлянда штора ' + size.replace(' × ', 'х'),
    category: 'shtora',
    subcategories: ['vulychni'],
    featured: false,
    cover: installations.warm.white,
    description:
      'Вулична гірлянда штора для ' + locations + '. Вертикальні нитки однакової довжини утворюють рівний нижній край.',
    specifications: [
      { label: 'Застосування', value: 'Вуличне' },
      { label: 'Джерело світла', value: 'Світлодіоди (LED)' },
      { label: 'Кількість світлодіодів', value: ledCount + ' LED' },
      { label: 'Кількість вертикальних ниток', value: String(drops) },
      CURTAIN_DROP_PITCH,
      { label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили' },
    ],
    variants: curtainVariants(ledCount, size, price, installations),
  };
}

const SNOWFLAKE_USE = { label: 'Призначення', value: 'Для приміщень і вулиці' };

function snowflakeMotif(
  slug: string,
  sku: string,
  size: string,
  glow: 'blue' | 'cool',
  mode: 'static' | 'flicker',
  price: number,
  file = slug,
  shape = '',
): Product {
  const name = 'Мотив сніжинка ' + size;
  const color = GLOW_OPTIONS[glow].label;
  const modeLabel = mode === 'static' ? 'статичний' : 'мерехтіння';
  const light = glow === 'blue' ? 'синім світлом' : 'холодним білим світлом';
  const photo = media(file, name + '. Світиться ' + light + '.', 'variant');
  const effect = mode === 'static' ? ' у статичному режимі' : ' з білим мерехтінням';
  const outline = shape ? ' Має ' + shape.toLowerCase() + '.' : '';

  return {
    slug,
    name,
    category: 'fihury',
    subcategories: ['snizhynky'],
    featured: false,
    cardSubtitle: color + ' · ' + modeLabel + (shape ? ' · ' + shape.toLowerCase() : ''),
    cover: photo,
    description:
      'Світлодіодна сніжинка для приміщень і вулиці, зокрема для оформлення фасадів і вітрин. Світиться ' +
      light +
      effect +
      '.' +
      outline,
    specifications: [
      { label: 'Тип гірлянди', value: 'Сніжинка' },
      { label: 'Режим роботи', value: modeLabel + ' (' + mode + ')' },
      SNOWFLAKE_USE,
      { label: 'Силовий кабель', value: 'Присутній' },
      { label: 'Напруга', value: '230 В' },
      { label: 'Клас захисту', value: 'IP44' },
    ],
    variants: [variant(sku, glow, 'black', size, price, photo)],
  };
}

const SNOWFLAKE_40_COOL = snowflakeMotif(
  'snizhynka-40x40-cool-flicker',
  'GY-SNOW40-CW',
  '40 × 40 см',
  'cool',
  'flicker',
  99_500,
);

const SNOWFLAKE_60_COOL = snowflakeMotif(
  'snizhynka-60x60-cool-flicker',
  'GY-SNOW60-CW',
  '60 × 60 см',
  'cool',
  'flicker',
  146_000,
);

// Keep the former shared URL and its two SKU selections usable for saved links.
export const LEGACY_SNOWFLAKE: Product = {
  ...SNOWFLAKE_40_COOL,
  slug: 'snizhynka',
  name: 'Мотив сніжинка',
  variants: [SNOWFLAKE_40_COOL.variants[0], SNOWFLAKE_60_COOL.variants[0]],
};

// Retain the exact products referenced by existing carts and direct product links.
export const ARCHIVED_ICICLES: readonly Product[] = [
  {
    slug: 'kontur-114',
    name: 'Гірлянда бахрома «Контур 114»',
    category: 'bakhroma',
    subcategories: ['vulychni'],
    featured: false,
    description:
      'Для карнизів і балконів. Дві секції по 1,5 м, статичне світіння, IP65. Кабель живлення купується окремо.',
    variants: miniLedVariants('kontur-114', 'GY-K114', '3 × 0,5 м'),
  },
  {
    slug: 'kontur-90',
    name: 'Гірлянда бахрома «Контур 90»',
    category: 'bakhroma',
    subcategories: ['vulychni'],
    featured: false,
    cover: ICICLE_WARM,
    description: 'Компактна бахрома 2 × 0,5 м зі статичним світінням для коротких карнизів і вхідних груп.',
    variants: [
      variant('GY-K090-WW-BK', 'warm', 'black', '2 × 0,5 м', 93_000, ICICLE_WARM),
      variant('GY-K090-CW-BK', 'cool', 'black', '2 × 0,5 м', 93_000, ICICLE_COOL),
      variant('GY-K090-WW-WH', 'warm', 'white', '2 × 0,5 м', 93_000, ICICLE_WARM),
      variant('GY-K090-CW-WH', 'cool', 'white', '2 × 0,5 м', 93_000, ICICLE_COOL),
    ],
  },
];

export const ASSORTMENT: readonly Product[] = [
  {
    slug: 'bakhroma-150',
    name: 'Гірлянда бахрома ' + ICICLE_SIZE,
    category: 'bakhroma',
    subcategories: ['vulychni'],
    featured: true,
    description:
      'Вулична бахрома зі 150 світлодіодами для карнизів, фасадів і входів. Стале світіння, білий або чорний каучуковий провід.',
    specifications: [...ICICLE_SPECIFICATIONS, { label: 'Режим світіння', value: 'Стале світіння' }],
    variants: icicleVariants(false),
  },
  {
    slug: 'bakhroma-150-merekhtinnia',
    name: 'Гірлянда бахрома ' + ICICLE_SIZE + ' з мерехтінням',
    category: 'bakhroma',
    subcategories: ['vulychni'],
    featured: false,
    description:
      'Вулична бахрома зі 150 світлодіодами. Оберіть тепле або холодне біле основне світіння. Окремі світлодіоди мерехтять холодним білим.',
    specifications: [...ICICLE_SPECIFICATIONS, { label: 'Колір мерехтіння', value: 'Холодний білий' }],
    variants: icicleVariants(true),
  },
  {
    slug: 'snowfall-50-10m',
    name: 'Гірлянда «Танучі бурульки» Snowfall, 10 м',
    cardSubtitle: '10 підвісів по 50 см · 720 LED',
    category: 'padayuchyi-snih',
    subcategories: ['vulychni'],
    featured: false,
    description:
      'Вулична гірлянда з білими світлодіодами, які послідовно загоряються згори вниз. Прозорі підвіси можна розмістити вздовж карниза або на гілках дерев.',
    specifications: [...LONG_SNOWFALL_SPECIFICATIONS, { label: 'З’єднання гірлянд', value: 'Так' }],
    // Retail reference for the longer 50 cm set, listed in 15 m by LEDWorld.
    variants: [
      variant(
        'GY-SNOWFALL-50-10M',
        'white',
        'transparent',
        '10 м',
        326_000,
        SNOWFALL_PHOTO,
        SNOWFALL_TEN_METRES_ON_TREES,
      ),
    ],
  },
  {
    slug: 'snowfall-50-3m',
    name: 'Гірлянда «Танучі бурульки» Snowfall, 3 м',
    cardSubtitle: '10 підвісів по 50 см · 720 LED',
    category: 'padayuchyi-snih',
    subcategories: ['vulychni'],
    featured: false,
    description:
      'Триметрова вулична гірлянда з довгими прозорими підвісами. Білі світлодіоди послідовно загоряються згори вниз, створюючи ефект падаючого снігу.',
    specifications: [...LONG_SNOWFALL_SPECIFICATIONS, { label: 'З’єднання гірлянд', value: 'Ні' }],
    variants: [
      variant(
        'GY-SNOWFALL-50-3M',
        'white',
        'transparent',
        '3 м',
        usdToKopiykas(60),
        SNOWFALL_PHOTO,
        SNOWFALL_THREE_METRES_ON_TREE,
      ),
    ],
  },
  {
    slug: 'meteor-30-3m',
    name: 'Гірлянда Meteor, 3 м',
    cardSubtitle: '10 підвісів по 30 см · 300 LED',
    category: 'padayuchyi-snih',
    subcategories: ['vulychni'],
    featured: false,
    description:
      'Вулична гірлянда з короткими прозорими підвісами для гілок дерев і карнизів. Біле світло рухається згори вниз, створюючи ефект падаючого снігу.',
    specifications: [
      ...SNOWFALL_SPECIFICATIONS,
      { label: 'Кількість світлодіодів', value: '300 LED' },
      { label: 'Довжина підвісу', value: '30 см' },
      { label: 'З’єднання гірлянд', value: 'Ні' },
    ],
    variants: [
      variant('GY-METEOR-30-3M', 'white', 'transparent', '3 м', usdToKopiykas(40), METEOR_PHOTO, METEOR_ON_TREE),
    ],
  },
  {
    slug: 'promin-100',
    name: 'Гірлянда нитка ' + STRAND_SIZE,
    category: 'nytka',
    subcategories: ['vulychni'],
    featured: true,
    description:
      'Вулична нитка зі 100 світлодіодами для дерев, перил і терас. Вісім варіантів сталого світіння, білий або чорний каучуковий провід.',
    specifications: [...STRAND_SPECIFICATIONS, { label: 'Режим світіння', value: 'Стале світіння' }],
    variants: strandVariants(false),
  },
  {
    slug: 'promin-100-merekhtinnia',
    name: 'Гірлянда нитка ' + STRAND_SIZE + ' з мерехтінням',
    category: 'nytka',
    subcategories: ['vulychni'],
    featured: false,
    description:
      'Вулична нитка зі 100 світлодіодами на білому або чорному каучуковому проводі. У білій версії основне світіння та яскравіші спалахи мають однаковий холодно-білий відтінок. У тепло-білій версії окремі діоди спалахують холодним білим.',
    specifications: [...STRAND_SPECIFICATIONS, { label: 'Колір мерехтіння', value: 'Холодний білий' }],
    variants: strandVariants(true),
  },
  {
    slug: 'zavisa-456',
    name: 'Гірлянда штора 2х1,5 м',
    category: 'shtora',
    subcategories: ['vulychni'],
    featured: true,
    cover: CURTAIN_WARM,
    description:
      'Вулична гірлянда штора з 456 світлодіодами для фасадів, вітрин і терас. Вертикальні нитки однакової довжини утворюють рівний нижній край.',
    specifications: [
      { label: 'Застосування', value: 'Вуличне' },
      { label: 'Джерело світла', value: 'Світлодіоди (LED)' },
      { label: 'Кількість світлодіодів', value: '456 LED' },
      { label: 'Кількість вертикальних ниток', value: '24' },
      CURTAIN_DROP_PITCH,
      { label: 'Напруга', value: '220 В' },
      { label: 'З’єднання секцій', value: 'До 5 гірлянд' },
      { label: 'Матеріал кабелю', value: 'Каучукова ізоляція, мідні жили' },
      { label: 'Заявлений строк служби', value: 'Необмежений' },
    ],
    variants: curtainVariants(456, CURTAIN_SIZE, 428_000, CURTAIN_456_INSTALLATIONS),
  },
  curtainModel(912, '2 × 3 м', 24, 705_000, 'високих вітрин і входів'),
  curtainModel(288, '1,5 × 1 м', 18, 378_000, 'вікон і невеликих вітрин'),
  {
    slug: 'sitka-2x1',
    name: 'Гірлянда сітка 2 × 1 м',
    category: 'sitka',
    subcategories: ['vulychni'],
    featured: false,
    description: NET_DESCRIPTION,
    specifications: NET_SPECIFICATIONS,
    variants: [variant('GY-NET-2X1', 'white', 'black', '2 × 1 м', 279_000, NET, NET_GARDEN, COMPACT_NET_DIAGRAM)],
  },
  {
    slug: 'sitka-288',
    name: 'Гірлянда сітка 2 × 1,5 м',
    category: 'sitka',
    subcategories: ['vulychni'],
    featured: false,
    description: NET_DESCRIPTION,
    specifications: NET_SPECIFICATIONS,
    variants: [variant('GY-NET288-WH', 'white', 'black', '2 × 1,5 м', 399_000, NET, NET_GARDEN, NET_DIAGRAM)],
  },
  {
    slug: 'sfera-20',
    name: 'Гірлянда з кульками «Сфера 20»',
    category: 'kulky',
    subcategories: ['vulychni'],
    featured: false,
    cover: GALAXY_WARM,
    description: '20 прозорих кульок на кабелі 10 м. Відстань між лампами 50 см.',
    variants: [
      variant('GY-S020-WW', 'warm', 'black', '10 м', 305_000, GALAXY_WARM),
      variant('GY-S020-CW', 'cool', 'black', '10 м', 305_000, GALAXY_COOL),
    ],
  },
  {
    slug: 'snizhynka-30x30-blue',
    name: 'Мотив сніжинка 30 × 30 см',
    category: 'fihury',
    subcategories: ['snizhynky'],
    featured: false,
    cardSubtitle: 'Синє світіння',
    description:
      'Світлодіодна сніжинка із синім світінням для приміщень і вулиці. Є кільце для підвішування. Через роз’єм можна послідовно з’єднувати сумісні сніжинки й подовжувати світлову композицію.',
    specifications: [
      { label: 'Тип гірлянди', value: 'Сніжинка' },
      SNOWFLAKE_USE,
      { label: 'Кабель живлення', value: 'У комплекті' },
    ],
    variants: [
      variant(
        'GY-SNOW30-BL',
        'blue',
        'black',
        '30 × 30 см',
        75_000,
        media('snizhynka-30x30-blue', 'Сніжинка 30 × 30 см із синім світінням і кабелем живлення', 'variant'),
        media(
          'snizhynka-30x30-blue-wiring',
          'Вимкнена сніжинка, кабель живлення та роз’єм для підключення наступної сніжинки',
          'variant',
        ),
      ),
    ],
  },
  snowflakeMotif('snizhynka-30x25-5-cool-flicker', 'GY-SNOW30X255-F-CW', '30 × 25,5 см', 'cool', 'flicker', 160_000),
  snowflakeMotif('snizhynka-40x40-blue', 'GY-SNOW40-BL', '40 × 40 см', 'blue', 'static', 95_000),
  snowflakeMotif('snizhynka-40x40-blue-flicker', 'GY-SNOW40-F-BL', '40 × 40 см', 'blue', 'flicker', 99_500),
  SNOWFLAKE_40_COOL,
  snowflakeMotif(
    'snizhynka-49-5x42-blue',
    'GY-SNOW495X42-BL',
    '49,5 × 42 см',
    'blue',
    'static',
    210_000,
    'snizhynka-blue-diamonds',
  ),
  snowflakeMotif('snizhynka-49-5x42-cool', 'GY-SNOW495X42-CW', '49,5 × 42 см', 'cool', 'static', 210_000),
  snowflakeMotif('snizhynka-60x60-blue', 'GY-SNOW60-BL', '60 × 60 см', 'blue', 'static', 139_000),
  SNOWFLAKE_60_COOL,
  snowflakeMotif(
    'snizhynka-60x60-cool-branches',
    'GY-SNOW60-F-CW-BR',
    '60 × 60 см',
    'cool',
    'flicker',
    146_000,
    'snizhynka-60x60-cool-branches',
    'Розгалужені промені',
  ),
  snowflakeMotif(
    'snizhynka-60-5x52-blue',
    'GY-SNOW605X52-BL',
    '60,5 × 52 см',
    'blue',
    'static',
    215_000,
    'snizhynka-blue-diamonds',
  ),
  {
    slug: 'retro-s14',
    name: 'Ретрогірлянда Belt light S14',
    category: 'retro',
    subcategories: ['vulychni'],
    featured: true,
    description:
      'Вулична ретрогірлянда для терас, альтанок і літніх майданчиків. Прозорі світлодіодні лампи S14 на чорному проводі дають рівне тепле біле світло.',
    specifications: [
      { label: 'Тип гірлянди', value: 'Belt light' },
      { label: 'Крок між лампами', value: '20 см' },
      { label: 'Режим світіння', value: 'Стале світіння' },
      { label: 'Призначення', value: 'Зовнішнє використання' },
      { label: 'Силовий кабель', value: 'Відсутній у комплекті' },
      { label: 'Напруга', value: '230 В' },
      { label: 'Клас захисту', value: 'IP44' },
    ],
    variants: [
      { ...variant('GY-S14-2-WW', 'warm', 'black', '2 м', 190_000, ...FILAMENT_GALLERY), lampCount: 10 },
      { ...variant('GY-S14-4-WW', 'warm', 'black', '4 м', 320_000, ...FILAMENT_GALLERY), lampCount: 20 },
    ],
  },
  {
    slug: 'spiral',
    name: 'LED-ялинка Magic Spiral 1,2 м',
    category: 'yalynky',
    subcategories: ['spiralni'],
    featured: false,
    cover: TREE,
    description:
      'Світлова ялинка для двору, тераси чи входу. Під’єднайте її до мережі 230 В. Колір, яскравість і режим світіння можна налаштувати пультом із комплекту або через застосунок, встановлений на смартфон. Спіраль плавно переливається або мерехтить, а зірка світиться білим.',
    specifications: [
      { label: 'Тип гірлянди', value: '3D-мотив' },
      { label: 'Режим роботи', value: 'Повне мерехтіння (all flicker)' },
      { label: 'Призначення', value: 'Зовнішнє використання' },
      { label: 'Силовий кабель', value: 'Присутній' },
      { label: 'Напруга', value: '230 В' },
      { label: 'Клас захисту', value: 'IP44' },
    ],
    variants: [
      variant('GY-SPIRAL120-RGB', 'rgb', null, '1,2 м', 695_000, TREE, TREE_GREEN, TREE_RAINBOW, TREE_ILLUSTRATION),
    ],
  },
  {
    slug: 'kabel-zhyvlennia-3a',
    name: 'Кабель живлення 3 А',
    category: 'aksesuary',
    subcategories: ['zhyvlennia'],
    featured: false,
    description: 'Кабель 1,5 м, IP65. Підходить до гірлянди нитки 10 м зі сталим світінням і «Контура 114».',
    variants: [
      variant('GY-P3A-BK', null, 'black', '1,5 м', usdToKopiykas(10)),
      variant('GY-P3A-WH', null, 'white', '1,5 м', usdToKopiykas(10)),
    ],
  },
];

export function findCatalogVariant(sku: string, products = ASSORTMENT) {
  for (const product of [...products, ...ARCHIVED_ICICLES]) {
    const variant = product.variants.find(item => item.sku === sku);

    if (variant) {
      return { product, variant };
    }
  }

  return undefined;
}
