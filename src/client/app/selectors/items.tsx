import { IAppState, IItemsMap, IItem } from 'reducers';

import { hasInitialDataLoaded } from './initialData';

export const shouldLoadUserItems = (state: IAppState) => {
  return !state.currentUser.hasItems && !state.loader.content && hasInitialDataLoaded(state);
};

export const shouldLoadEditItem = (state: IAppState, itemId: string) => {
  return itemId && !state.loader.content && !state.admin.items[itemId] && hasInitialDataLoaded(state);
};

export const getItemsMap = (state: IAppState): IItemsMap => state.items.dataMap;

export const getSelectedItemId = (state: IAppState) => state.items.selectedId;

export const getSelectedItem = (state: IAppState, routeState): Partial<IItem> => {
  const selectedId = routeState ? routeState.itemId : getSelectedItemId(state);
  return getItemsMap(state)[selectedId];
};

export const shouldLoadViewItem = (state: IAppState, routeState) => {
  const selectedItem = getSelectedItem(state, routeState);
  return (!selectedItem || !selectedItem.isFullyLoaded) && hasInitialDataLoaded(state);
};
