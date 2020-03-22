import { ICityFilters, CitiesFilterState } from 'types/filters';
import { FiltersActionTypes } from 'types';

export const setCityFilters = (cityId: string, filters: ICityFilters) => ({
  type: FiltersActionTypes.SET_CITY_FILTERS,
  cityId,
  filters
}) as const;

export const receiveCityFilters = (filters: CitiesFilterState) => ({
  type: FiltersActionTypes.RECEIVE_CITY_FILTERS,
  filters
}) as const;
