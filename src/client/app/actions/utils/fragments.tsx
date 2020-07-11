import { types } from 'typed-graphqlify';
import { Item, TranslatableField, IsEnabled } from 'global-utils/data-models';
import { Locale } from 'global-utils/typings';
import { LANGUAGES } from 'global-utils/constants';
import { graphqlFragment } from 'client-utils/methods';

export function getLanguagesInput<T extends string | boolean>(type: T, locale?: Locale) {
  const languages = locale ? [locale] : LANGUAGES;

  type ReturnType = typeof type extends string ? TranslatableField : IsEnabled;

  return languages.reduce<Partial<ReturnType>>((acc, lang) => {
    acc[lang] = type;
    return acc;
  }, {});
}

export const getTranslatableFieldFragment = (fragmentName: string, locale?: Locale) => graphqlFragment<TranslatableField>(
  fragmentName,
  'TranslatableField',
  getLanguagesInput(types.string, locale)
);

export const getNameFieldFragment = (locale?: Locale) => graphqlFragment<TranslatableField>(
  'nameFieldFragment',
  'NameField',
  getLanguagesInput(types.string, locale)
);

export const getIsEnabledFragment = (locale?: Locale) => graphqlFragment<IsEnabled>(
  'isEnabledFragment',
  'IsEnabled',
  getLanguagesInput(types.boolean, locale)
);

export const getImagesFragment = () => graphqlFragment<Item>('imagesFragment', 'Item', {
  mainImage: types.string,
  images: [{
    id: types.string,
    fileName: types.string,
    path: types.string,
    thumbName: types.string
  }]
});

export const getMainInfoFragment = (locale?: Locale) => graphqlFragment<Item>('mainInfoFragment', 'Item', {
  id: types.string,
  name: getNameFieldFragment(locale),
  alias: getTranslatableFieldFragment('aliasFragment', locale),
  isEnabled: getIsEnabledFragment(locale),
  cityId: types.string,
  price: {
    from: types.number,
    to: types.number
  },
  currency: types.string,
  address: types.string,
  types: [types.string],
  userId: types.string,
  isApprovedByAdmin: types.boolean,
  isRecommended: types.boolean,
  createdAt: types.string,
  updatedAt: types.string
});

export const getDescriptionFragment = (locale?: Locale) => graphqlFragment<Item>('descriptionFragment', 'Item', {
  description: getTranslatableFieldFragment('description', locale),
  metaTitle: getTranslatableFieldFragment('metaTitle', locale),
  metaDescription: getTranslatableFieldFragment('metaDescription', locale)
});

export const getItemFragment = (locale?: Locale) => graphqlFragment<Item>('itemFragment', 'Item', {
  ...getMainInfoFragment(locale),
  ...getDescriptionFragment(locale),
  ...getImagesFragment()
});
