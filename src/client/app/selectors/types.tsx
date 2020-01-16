import { createSelector } from 'reselect';
import { IAppState, ITypesMap } from 'types';
import { IType } from 'global-utils/typings';

export const getTypesMap = (state: IAppState): ITypesMap => state.types.dataMap;

export const getTypesAliases = (state: IAppState) => state.types.aliases;

export const getTypeById = (state: IAppState, typeId: string): IType => getTypesMap(state)[typeId];

export const shouldLoadType = (state: IAppState, typeId: string) => {
  const type = getTypeById(state, typeId);
  return typeId && !state.loader.content && (!type || !type.isFullyLoaded);
};

export const getTypes = createSelector(
  [getTypesMap],
  (typesMap: ITypesMap) => Object.values(typesMap)
);
