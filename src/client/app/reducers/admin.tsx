
import { TCityFields } from 'global-utils';
import { RECEIVE_ADMIN_CITY } from 'actions';

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
    default:
      return state;
  }
};
