
import { TCityFields, TTypeFields } from 'global-utils';
import { RECEIVE_ADMIN_CITY, RECEIVE_ADMIN_TYPE, REMOVE_CITY, REMOVE_TYPE } from 'actions';
import { removeItemById } from 'client-utils';

export interface IAdminState {
  cities: Record<string, TCityFields>;
  types: Record<string, TTypeFields>;
}

const initialState = {
  cities: {},
  types: {},
};

export const admin = (state: IAdminState = initialState, action): IAdminState => {
  switch (action.type) {
    case RECEIVE_ADMIN_CITY:
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: action.adminCity,
        },
      };
    case RECEIVE_ADMIN_TYPE:
      return {
        ...state,
        types: {
          ...state.types,
          [action.typeId]: action.adminType,
        },
      };
    case REMOVE_CITY:
      return {
        ...state,
        cities: removeItemById(action.cityId, state.cities),
      };
    case REMOVE_TYPE:
      return {
        ...state,
        types: removeItemById(action.typeId, state.types),
      };
    default:
      return state;
  }
};
