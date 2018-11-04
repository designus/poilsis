
import { TCityFields } from 'global-utils';
import { RECEIVE_LOADED_CITY } from 'actions';

export interface IAdminState {
  cities: Record<string, TCityFields>;
}

const initialState = {
  cities: {},
};

export const admin = (state: IAdminState = initialState, action): IAdminState => {
  switch (action.type) {
    case RECEIVE_LOADED_CITY:
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.city.id]: action.city,
        },
      };
    default:
      return state;
  }
};
