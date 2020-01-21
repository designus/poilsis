import { IAppState } from 'types';

export const isInitialDataLoaded = (state: IAppState, isAdminArea: boolean) => {
  const { isLoaded, isMultiLang } = state.initialData;
  if (isAdminArea) {
    return isLoaded && isMultiLang;
  }

  return isLoaded;
};
