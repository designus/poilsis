import { IAppState, ActiveItem } from 'types';
import { getCitiesAliases } from './cities';
import { getItemsAliases } from './items';
import { getTypesAliases } from './types';

export const getActiveItem = (state: IAppState, pathName: string) => {
  const [locale, alias1, alias2] = pathName.split('/').filter(Boolean);
  const city = getCitiesAliases(state)[alias1];
  const item = getItemsAliases(state)[alias2];
  const type = getTypesAliases(state)[alias2];

  if (item) {
    return ActiveItem.Item;
  }

  if (type) {
    return ActiveItem.Type;
  }

  if (city) {
    return ActiveItem.City;
  }

  return ActiveItem.Home;
};
