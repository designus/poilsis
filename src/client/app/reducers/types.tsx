import { Reducer } from 'redux';
import { ITypesState, TypesActionTypes, TypesActions, InitialDataActionTypes, InitialDataActions } from 'types';
import { getAliasState, removeByKeys, getAliasKeysById } from 'client-utils/methods';

type ActionTypes = TypesActions | InitialDataActions;

const getInitialState = (): ITypesState => ({
  dataMap: {},
  aliases: {}
});

export const types: Reducer<ITypesState, ActionTypes> = (state: ITypesState = getInitialState(), action): ITypesState => {
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
            ...action.newType
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
          [action.id]: {
            ...state.dataMap[action.id],
            isEnabled: {
              ...state.dataMap[action.id].isEnabled,
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
