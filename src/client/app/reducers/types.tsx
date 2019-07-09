import { SELECT_TYPE, RECEIVE_CLIENT_TYPE, REMOVE_TYPE } from 'actions/types';
import { RECEIVE_INITIAL_DATA, CLEAR_STATE } from 'actions/initialData';
import { IGenericState, IGenericDataMap } from 'client-utils/types';
import { ITypeFields } from 'global-utils';

export interface IType extends ITypeFields {}

export type ITypesMap = IGenericDataMap<IType>;
export interface ITypesState extends IGenericState<IType> {
  selectedId?: string;
}

const getInitialState = () => ({
  dataMap: {},
  aliases: []
});

export const types = (state: ITypesState = getInitialState(), action): ITypesState => {
  switch (action.type) {
    case CLEAR_STATE:
      return getInitialState();
    case RECEIVE_INITIAL_DATA:
      return {...state, ...action.data.types};
    case RECEIVE_CLIENT_TYPE:
      return {
        ...state,
        aliases: [...state.aliases, { id: action.newType.id, alias: action.newType.alias }],
        dataMap: {
          ...state.dataMap,
          [action.newType.id]: {
            ...(state.dataMap[action.newType.id] || {}),
            ...action.newType
          }
        }
      };
    case REMOVE_TYPE:
      const { [action.typeId]: removedType, ...dataMap } = state.dataMap;
      return {
        ...state,
        dataMap,
        aliases: [...state.aliases.filter(alias => alias.id !== action.typeId)]
      };
    case SELECT_TYPE:
      return {...state, selectedId: action.typeId};
    default:
      return state;
  }
};
