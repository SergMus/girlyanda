interface ComparisonImage {
  readonly src: string;
  readonly alt: string;
}

interface ComparisonImages {
  readonly before: ComparisonImage;
  readonly after: ComparisonImage;
}

export const HOUSE_COMPARISON_IMAGES: ComparisonImages = {
  before: { src: '/media/house-day.webp', alt: 'Заміський будинок до монтажу святкової підсвітки' },
  after: { src: '/media/house-night.webp', alt: 'Той самий будинок із гірляндами вздовж даху й над входом' },
};
