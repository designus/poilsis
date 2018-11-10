
import { TCityFields } from 'global-utils';
import { RECEIVE_ADMIN_CITY, REMOVE_CITY } from 'actions';
import { removeItemById } from 'client-utils';

export interface IAdminState {
  cities: Record<string, TCityFields>;
}

const initialState = {
  cities: {},
};

export const admin = (state: IAdminState = initialState, action): IAdminState => {
  switch (action.type) {
    case RECEIVE_ADMIN_CITY:
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: action.city,
        },
      };
    case REMOVE_CITY:
      return {
        ...state,
        cities: removeItemById(action.cityId, state.cities),
      };
    default:
      return state;
  }
};
