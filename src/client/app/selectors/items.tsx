import { IAppState, IItemsMap } from 'reducers';
import { hasInitialDataLoaded } from './initialData';

export const shouldLoadItems = (state: IAppState) => {
  return !state.currentUser.isAllLoaded && !state.loader.content && hasInitialDataLoaded(state);
};

export const shouldLoadItem = (state: IAppState, itemId: string) => {
  return !state.loader.content && !state.admin.items[itemId] && hasInitialDataLoaded(state);
};

export const getItems = (state: IAppState): IItemsMap => state.items.dataMap;
