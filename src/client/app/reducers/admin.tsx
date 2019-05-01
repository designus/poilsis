
import { TCityFields, TTypeFields, TItemFields } from 'global-utils';
import {
  RECEIVE_ADMIN_CITY,
  RECEIVE_ADMIN_TYPE,
  RECEIVE_ADMIN_ITEM,
  REMOVE_CITY,
  REMOVE_TYPE,
  REMOVE_ITEM,
  CLEAR_STATE,
  RECEIVE_ADMIN_ITEM_DESCRIPTION,
  RECEIVE_IMAGES,
} from 'actions';
import { removeItemById } from 'client-utils';

export interface IAdminState {
  cities: Record<string, TCityFields>;
  types: Record<string, TTypeFields>;
  items: Record<string, TItemFields>;
}

const getInitialState = () => ({
  cities: {},
  types: {},
  items: {},
});

export const admin = (state: IAdminState = getInitialState(), action): IAdminState => {
  switch (action.type) {
    case CLEAR_STATE:
      return getInitialState();
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
    case RECEIVE_ADMIN_ITEM_DESCRIPTION:
      return {
        ...state,
        items: {
          ...state.items,
          [action.itemId]: {
            ...state.items[action.itemId],
            ...action.descFields,
          },
        },
      };
    case RECEIVE_IMAGES:
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: {
            ...state.items[action.id],
            images: action.images,
          },
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
