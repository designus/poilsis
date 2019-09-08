import { IAppState, IItemsMap } from 'types';
import { IItem } from 'global-utils/typings';

export const shouldLoadUserItems = (state: IAppState) =>
  !state.currentUser.hasItems && !state.loader.content;

export const getItemsMap = (state: IAppState): IItemsMap => state.items.dataMap;

export const getItemsAliases = (state: IAppState) => state.items.aliases;

export const getItemById = (state: IAppState, id: string): IItem => getItemsMap(state)[id];

export const shouldLoadEditItem = (state: IAppState, itemId: string) => {
  return itemId && !state.loader.content && !getItemById(state, itemId);
};

export const getItemByAlias = (state: IAppState, itemAlias: string, locale: string): IItem => {
  const aliases = getItemsAliases(state);
  const itemsMap = getItemsMap(state);
  const alias = aliases.find(alias => alias.alias === itemAlias);
  if (alias) {
    return itemsMap[alias.id];
  }

  return null;
};

