import { IAppState } from 'types';
import { isLoggedIn } from 'selectors';

export const isInitialDataLoaded = (state: IAppState) => {
  const { isLoaded, isMultiLang } = state.initialData;
  return isLoggedIn(state) ? isLoaded && isMultiLang : isLoaded;
};
