import { IItem, TranslatableField, Locale, ObjectKeys } from 'global-utils/typings';
import { LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils/constants';
import shortId from 'shortid';
import { formatValue } from './methods';

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

const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const getItemName = (names: string[], index: number): TranslatableField => {
  return LANGUAGES.reduce((acc: TranslatableField, lang: Locale) => {
    acc[lang] = lang === DEFAULT_LANGUAGE ? names[index] : `${lang} - ${names[index]}`;
    return acc;
  }, {});
};

const getItemAlias = (name: TranslatableField, index: number): TranslatableField => {
  const keys = Object.keys(name) as ObjectKeys<typeof name>;
  return keys.reduce((acc: TranslatableField, lang) => {
    acc[lang] = `${formatValue(name[lang])}-${index}`;
    return acc;
  }, {});
};

export const generateMockedData = (count: number, cityIds: string[], typeIds: string[]): IItem[] => {
  const items: IItem[] = [];

  let nameIndex = 0;
  for (let i = 0; i < count; i++) {
    const cityId = cityIds[getRandomNumber(0, cityIds.length - 1)];
    const types = [typeIds[getRandomNumber(0, typeIds.length - 1)]];
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
