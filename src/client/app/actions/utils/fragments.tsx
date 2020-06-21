import { types } from 'typed-graphqlify';
import { Item, TranslatableField } from 'global-utils/data-models';
import { graphqlFragment } from 'client-utils/methods';

export const translatableFieldFragment = graphqlFragment<TranslatableField>('translatableFieldFragment', 'TranslatableField', {
  lt: types.string,
  en: types.string,
  ru: types.string
});

export const nameFieldFragment = graphqlFragment<TranslatableField>('nameFieldFragment', 'NameField', {
  lt: types.string,
  en: types.string,
  ru: types.string
});

export const imagesFragment = graphqlFragment<Item>('imagesFragment', 'Item', {
  mainImage: types.string,
  images: [{
    id: types.string,
    fileName: types.string,
    path: types.string,
    thumbName: types.string
  }]
});

export const mainInfoFragment = graphqlFragment<Item>('mainInfoFragment', 'Item', {
  id: types.string,
  name: nameFieldFragment,
  alias: translatableFieldFragment,
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
  updatedAt: types.string,
  isEnabled: {
    lt: types.boolean,
    en: types.boolean,
    ru: types.boolean
  }
});
