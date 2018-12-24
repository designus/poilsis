import { IAppState } from 'reducers';

export const hasInitialDataLoaded = (state: IAppState) => state.initialData.isLoaded;

export const isInitialDataLoading = (state: IAppState) => state.loader.global;

export const shouldLoadInitialData = (state: IAppState) =>
  !hasInitialDataLoaded(state) && !isInitialDataLoading(state);
