import { IAppState, IItemsMap } from 'types';
import { Item } from 'global-utils/data-models';

export const shouldLoadUserItems = (state: IAppState) =>
  !state.currentUser.hasItems && !state.loader.content;

export const getItemsMap = (state: IAppState): IItemsMap => state.items.dataMap;

export const getItemsAliases = (state: IAppState) => state.items.aliases;

export const getItemById = (state: IAppState, id: string): Item => getItemsMap(state)[id];

export const shouldLoadEditItem = (state: IAppState, itemId: string): boolean => {
  const item = getItemById(state, itemId);
  return Boolean(itemId && !state.loader.content && (!item || !item.isFullyLoaded));
};

export const getItemByAlias = (state: IAppState, alias: string): Item | null => {
  const aliases = getItemsAliases(state);
  const itemsMap = getItemsMap(state);
  const itemId = aliases[alias];
  if (itemId) {
    return itemsMap[itemId];
  }

  return null;
};
