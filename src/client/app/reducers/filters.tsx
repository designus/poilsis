import { Reducer } from 'redux';
import { FiltersActions, FiltersActionTypes, IFiltersState, ICityFilters } from 'types';

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
    case FiltersActionTypes.SET_TYPE_FILTER:
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: {
            ...state.cities[action.cityId],
            type: action.filterValue
          }
        }
      };
    case FiltersActionTypes.SET_PRICE_FILTER:
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: {
            ...state.cities[action.cityId],
            price: action.filterValue
          }
        }
      };
    default:
      return state;
  }
};
