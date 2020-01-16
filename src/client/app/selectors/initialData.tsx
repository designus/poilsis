import { IAppState } from 'types';

export const isInitialDataLoaded = (state: IAppState) => state.initialData.isLoaded;
