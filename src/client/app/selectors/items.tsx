import { IAppState } from 'reducers';
import { CONTENT_LOADER_ID } from 'client-utils';
import { hasInitialDataLoaded } from './initialData';

export const shouldLoadItems = (state: IAppState) => {
  return !state.currentUser.isAllLoaded && !state.loader[CONTENT_LOADER_ID] && hasInitialDataLoaded(state);
};

export const shouldLoadItem = (state: IAppState, itemId: string) => {
  return !state.loader[CONTENT_LOADER_ID] && !state.admin.items[itemId] && hasInitialDataLoaded(state);
};
