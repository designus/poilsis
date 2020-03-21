import { IItem, TranslatableField, Locale, ObjectKeys, Price } from 'global-utils/typings';
import { LANGUAGES, DEFAULT_LANGUAGE, GLOBAL_CURRENCY } from 'global-utils/constants';
import shortId from 'shortid';
import { formatValue, getRandomNumber } from './methods';

const userId = 'asd2234zl';
const names = [
  'Pušų paunksmė',
  'Almuka',
  'Pas Juozapą',
  'Po kaštonu',
  'Poilsis Palangoje pas Antaną',
  'Roberto vila',
  'Gintarinė kopa',
  'Pajūrio apartamentai Palangoje',
  'Poilsio namai Palangoje Saulė',
  'Vila Elena',
  'Apartamentai saulės krantas',
  'Viešbutis Palangoje - Tauras Center Hotel',
  '2 ir 3 kambarių būtai',
  'Vila krantas',
  'Birutės Vila',
  'Kotedžas Palangoje',
  'Namelio nuoma palangoje',
  'Šeimos atostogoms namelio nuoma',
  'Kopų namai',
  'Kontininkų nameliai',
  'Vila veneda',
  'Sodyba Palangoje',
  'Ramios bitės poilsio namai',
  'Romo sodyba',
  'Svečių namai vėjo burė',
  'Vilos ir namelių nuoma Palangoje',
  'Vila Z Palanga',
  'Smėlio kopos apartamentai',
  'Ritos apartamentai',
  'Alanga ****',
  'Alvika - kambarių ir būtų nuoma',
  'Vila bangomūša',
  'Kerpė ****',
  'Apartamentai Palangoje - Obelynė'
];


const getItemName = (names: string[], index: number): TranslatableField => {
  return LANGUAGES.reduce<TranslatableField>((acc, locale) => {
    acc[locale] = locale === DEFAULT_LANGUAGE ? names[index] : `${locale} - ${names[index]}`;
    return acc;
  }, {} as TranslatableField);
};

const getItemAlias = (name: TranslatableField, index: number): TranslatableField => {
  return LANGUAGES.reduce<TranslatableField>((acc, locale) => {
    acc[locale] = `${formatValue(name[locale])}-${index}`;
    return acc;
  }, {} as TranslatableField);
};

const getPrice = (): Price => {
  const priceFrom = getRandomNumber(15, 30);
  const priceTo = getRandomNumber(30, 60);
  const showPriceTo = getRandomNumber(0, 1);

  return {
    from: priceFrom,
    to: showPriceTo ? priceTo : null
  };
};

export const generateMockedData = (count: number, cityIds: string[], typeIds: string[]): IItem[] => {
  const items: IItem[] = [];

  let nameIndex = 0;
  for (let i = 0; i < count; i++) {
    const cityId = cityIds[getRandomNumber(0, cityIds.length - 1)];
    const types = [typeIds[getRandomNumber(0, typeIds.length - 1)]];
    const price = getPrice();
    const name = getItemName(names, nameIndex);
    const alias = getItemAlias(name, i);
    items.push({
      id: shortId.generate(),
      name,
      alias,
      address: `address ${i}`,
      cityId,
      images: [],
      types,
      userId,
      isApprovedByAdmin: true,
      isEnabled: {
        en: true,
        lt: true,
        ru: true
      },
      price,
      currency: GLOBAL_CURRENCY,
      isRecommended: i < 5,
      mainImage: '',
      description: {
        en: 'This is en description',
        lt: 'This is lt description',
        ru: 'This is ru description'
      },
      metaTitle: {
        en: '',
        lt: '',
        ru: ''
      },
      metaDescription: {
        en: '',
        lt: '',
        ru: ''
      }
    });

    nameIndex = nameIndex < names.length - 1 ? nameIndex + 1 : 0;

  }

  return items;
};
