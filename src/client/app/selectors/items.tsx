import { IAppState } from 'reducers';
import { CONTENT_LOADER_ID } from 'client-utils';
import { hasInitialDataLoaded } from './initialData';

export const shouldLoadItems = (state: IAppState) => {
  return !state.currentUser.isAllLoaded && !state.loader[CONTENT_LOADER_ID] && hasInitialDataLoaded(state);
};
