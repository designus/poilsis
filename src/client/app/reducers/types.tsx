import { SELECT_TYPE, RECEIVE_TYPE, REMOVE_TYPE, RECEIVE_INITIAL_DATA } from '../actions';
import { IGenericState, IGenericDataMap } from '../client-utils';
import { ITypeFields } from 'global-utils';

export interface IType extends ITypeFields {}

export type ITypesMap = IGenericDataMap<IType>;
export interface ITypesState extends IGenericState<IType> {}

export const types = (state: ITypesState = null, action) => {
  switch (action.type) {
    case RECEIVE_INITIAL_DATA:
      return {...state, ...action.data.types};
    case RECEIVE_TYPE:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.newType.id]: {
            ...(state.dataMap[action.newType.id] || {}),
            ...action.newType,
          },
        },
      };
    case REMOVE_TYPE:
      const {[action.typeId]: removedType, ...dataMap} = state.dataMap;
      return {
        ...state,
        dataMap,
      };
    case SELECT_TYPE:
      return {...state, selectedId: action.typeId};
    default:
      return state;
  }
};
