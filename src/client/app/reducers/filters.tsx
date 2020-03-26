import { Reducer } from 'redux';
import { FiltersActions, FiltersActionTypes, IFiltersState, ICityFilters } from 'types';

export const getInitialCityFilters = (): ICityFilters => ({
  type: '',
  price: {
    from: 0,
    to: null
  }
});

export const getInitialFiltersState = (): IFiltersState => ({
  cities: {}
});

export const filters: Reducer<IFiltersState, FiltersActions> = (state: IFiltersState = getInitialFiltersState(), action): IFiltersState => {
  switch (action.type) {
    case FiltersActionTypes.SET_CITY_FILTERS:
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: {
            ...state.cities[action.cityId],
            ...action.filters
          }
        }
      };
    case FiltersActionTypes.RECEIVE_CITY_FILTERS:
      return {
        ...state,
        cities: action.filters
      };
    default:
      return state;
  }
};
