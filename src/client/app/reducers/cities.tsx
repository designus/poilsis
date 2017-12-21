import { SELECT_CITY, RECEIVE_INITIAL_DATA } from '../actions';
import { IGenericState } from '../client-utils';

export interface ICityMap {
  id: string;
  alias: string;
  description: string;
  name: string;
  types: string[];
}

export interface ICityState extends IGenericState<ICityMap> {
  selectedId?: string;
};

export const cities = (state: ICityState = null, action): ICityState => {
  switch (action.type) {
    case SELECT_CITY:
      return {...state, selectedId: action.cityId};
    case RECEIVE_INITIAL_DATA:
      return {...state, ...action.data.cities, items: {}};
    default:
      return state;
  }
};
