import { IAppState } from 'types';

export const hasInitialDataLoaded = (state: IAppState) => state.initialData.isLoaded;
