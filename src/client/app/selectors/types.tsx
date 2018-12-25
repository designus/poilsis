import { createSelector } from 'reselect';
import { IAppState, ITypesMap } from 'reducers';
import { hasInitialDataLoaded } from 'selectors';

export const shouldLoadType = (state: IAppState, typeId: string) => {
  return typeId && !state.loader.content && !state.admin.types[typeId] && hasInitialDataLoaded(state);
};

export const getTypesMap = (state: IAppState): ITypesMap => state.types.dataMap;

export const getTypes = createSelector(
  [getTypesMap],
  (typesMap: ITypesMap) => Object.values(typesMap),
);
