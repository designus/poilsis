
import { TCityFields, TTypeFields, TItemFields } from 'global-utils';
import { RECEIVE_ADMIN_CITY, RECEIVE_ADMIN_TYPE, RECEIVE_ADMIN_ITEM, REMOVE_CITY, REMOVE_TYPE, REMOVE_ITEM } from 'actions';
import { removeItemById } from 'client-utils';

export interface IAdminState {
  cities: Record<string, TCityFields>;
  types: Record<string, TTypeFields>;
  items: Record<string, TItemFields>;
}

const initialState = {
  cities: {},
  types: {},
  items: {},
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
    case RECEIVE_ADMIN_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          [action.itemId]: action.adminItem,
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
    case REMOVE_ITEM:
      return {
        ...state,
        items: removeItemById(action.itemId, state.items),
      };
    default:
      return state;
  }
};
