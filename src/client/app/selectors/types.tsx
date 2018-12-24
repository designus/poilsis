import { IAppState } from 'reducers';
import { hasInitialDataLoaded } from 'selectors';

export const shouldLoadType = (state: IAppState, typeId: string) => {
  return !state.loader.content && !state.admin.types[typeId] && hasInitialDataLoaded(state);
};
