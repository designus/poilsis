import { IAppState, IItemsMap } from 'reducers';
import { IItem } from 'global-utils/typings';

import { hasInitialDataLoaded } from './initialData';

export const shouldLoadUserItems = (state: IAppState) =>
  !state.currentUser.hasItems && !state.loader.content && hasInitialDataLoaded(state);

export const getItemsMap = (state: IAppState): IItemsMap => state.items.dataMap;

export const getItemById = (state: IAppState, id: string): IItem => getItemsMap(state)[id];

export const shouldLoadEditItem = (state: IAppState, itemId: string) => {
  return itemId && !state.loader.content && !getItemById(state, itemId) && hasInitialDataLoaded(state);
};

export const getSelectedItemId = (state: IAppState) => state.items.selectedId;

export const getSelectedItem = (state: IAppState, routeState): Partial<IItem> => {
  const selectedId = routeState ? routeState.itemId : getSelectedItemId(state);
  return getItemsMap(state)[selectedId];
};

export const shouldLoadViewItem = (state: IAppState, routeState) => {
  const selectedItem = getSelectedItem(state, routeState);
  if (selectedItem) {
    return (!selectedItem || !selectedItem.isFullyLoaded) && hasInitialDataLoaded(state);
  }
};
