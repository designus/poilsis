import { Reducer } from 'redux';
import { ITypesState, TypesActionTypes, TypesActions, InitialDataActionTypes, InitialDataActions } from 'types';
import { getAliasState, removeByKeys, getAliasKeysById } from 'client-utils/methods';
import { IsEnabled } from 'data-models';

type ActionTypes = TypesActions | InitialDataActions;

export const getInitialTypesState = (): ITypesState => ({
  dataMap: {},
  aliases: {}
});

export const types: Reducer<ITypesState, ActionTypes> = (state: ITypesState = getInitialTypesState(), action): ITypesState => {
  switch (action.type) {
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA:
      return {
        ...state,
        ...action.types
      };
    case TypesActionTypes.RECEIVE_TYPE:
      return {
        ...state,
        aliases: {
          ...state.aliases,
          ...getAliasState(action.newType.alias, action.newType.id)
        },
        dataMap: {
          ...state.dataMap,
          [action.newType.id]: {
            ...(state.dataMap[action.newType.id] || {}),
            ...action.newType,
            isFullyLoaded: true
          }
        }
      };
    case TypesActionTypes.REMOVE_TYPE:
      return {
        ...state,
        dataMap: removeByKeys([action.typeId], state.dataMap),
        aliases: removeByKeys(getAliasKeysById(state, action.typeId), state.aliases)
      };
    case TypesActionTypes.TOGGLE_TYPE_ENABLED:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.typeId]: {
            ...state.dataMap[action.typeId],
            isEnabled: {
              ...state.dataMap[action.typeId].isEnabled as IsEnabled,
              [action.locale]: action.isEnabled
            }
          }
        }
      };
    case TypesActionTypes.SELECT_TYPE:
      return {
        ...state,
        selectedId: action.typeId
      };
    default:
      return state;
  }
};
