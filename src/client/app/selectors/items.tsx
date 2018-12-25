import { IAppState, IItemsMap } from 'reducers';
import { hasInitialDataLoaded } from './initialData';

export const shouldLoadItems = (state: IAppState) => {
  return !state.currentUser.hasItems && !state.loader.content && hasInitialDataLoaded(state);
};

export const shouldLoadItem = (state: IAppState, itemId: string) => {
  return itemId && !state.loader.content && !state.admin.items[itemId] && hasInitialDataLoaded(state);
};

export const getItemsMap = (state: IAppState): IItemsMap => state.items.dataMap;
