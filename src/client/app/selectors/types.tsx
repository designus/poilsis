import { createSelector } from 'reselect';
import { IAppState, ITypesMap } from 'types';
import { Type } from 'global-utils/data-models';

export const getTypesMap = (state: IAppState): ITypesMap => state.types.dataMap;

export const getTypesAliases = (state: IAppState) => state.types.aliases;

export const getTypeById = (state: IAppState, typeId: string): Type => getTypesMap(state)[typeId];

export const shouldLoadType = (state: IAppState, typeId: string): boolean => {
  const type = getTypeById(state, typeId);
  return Boolean(typeId && !state.loader.content && (!type || !type.isFullyLoaded));
};

export const getTypes = createSelector<IAppState, ITypesMap, Type[]>(
  [getTypesMap],
  (typesMap: ITypesMap) => Object.values(typesMap)
);
