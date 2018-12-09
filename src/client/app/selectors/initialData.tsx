import { IAppState } from 'reducers';

export const hasInitialDataLoaded = (state: IAppState) => state.initialData.isLoaded;
