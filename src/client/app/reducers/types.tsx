import { Reducer } from 'redux';
import { ITypesState, TypesActionTypes, TypesActions, InitialDataActionTypes, InitialDataActions } from 'types';

type ActionTypes = TypesActions | InitialDataActions;

const getInitialState = (): ITypesState => ({
  dataMap: {},
  aliases: []
});

export const types: Reducer<ITypesState, ActionTypes> = (state: ITypesState = getInitialState(), action): ITypesState => {
  switch (action.type) {
    case InitialDataActionTypes.CLEAR_STATE:
      return getInitialState();
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA:
      return {
        ...state,
        ...action.data.types
      };
    case TypesActionTypes.RECEIVE_TYPE:
      return {
        ...state,
        aliases: [
          ...state.aliases,
          {
            id: action.newType.id,
            alias: action.newType.alias
          }
        ],
        dataMap: {
          ...state.dataMap,
          [action.newType.id]: {
            ...(state.dataMap[action.newType.id] || {}),
            ...action.newType
          }
        }
      };
    case TypesActionTypes.REMOVE_TYPE:
      const { [action.typeId]: removedType, ...dataMap } = state.dataMap;
      return {
        ...state,
        dataMap,
        aliases: [...state.aliases.filter(alias => alias.id !== action.typeId)]
      };
    case TypesActionTypes.SELECT_TYPE:
      return {...state, selectedId: action.typeId};
    default:
      return state;
  }
};
