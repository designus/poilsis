import { Price } from 'data-models';
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

export const setTypeFilter = (cityId: string, filterValue: string) => ({
  type: FiltersActionTypes.SET_TYPE_FILTER,
  cityId,
  filterValue
}) as const;

export const setPriceFilter = (cityId: string, filterValue: Price) => ({
  type: FiltersActionTypes.SET_PRICE_FILTER,
  cityId,
  filterValue
}) as const;
