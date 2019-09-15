import { IAppState } from 'types';
import { ActiveItem } from 'components/menu/clientTopMenu/types';
import { getCitiesAliases } from './cities';

export const getActiveTopMenuItem = (state: IAppState, pathName: string) => {
  const [locale, alias1, alias2] = pathName.split('/').filter(Boolean);

  if (getCitiesAliases(state)[alias1]) {
    return ActiveItem.Offers;
  }

  return ActiveItem.Home;
};
