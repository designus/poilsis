import { IAppState } from 'reducers';
import { hasInitialDataLoaded } from 'selectors';

export const shouldLoadCity = (state: IAppState, cityId: string) => {
  return !state.loader.content && !state.admin.cities[cityId] && hasInitialDataLoaded(state);
};
