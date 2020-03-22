import { Price } from 'global-utils/typings';
import { setCityFilters, receiveCityFilters } from 'actions/filters';

export interface ICityFilters {
  type: string;
  price: Price;
}

export type CitiesFilterState = Record<string, ICityFilters>;

export interface IFiltersState {
  cities: CitiesFilterState;
}

export enum FiltersActionTypes {
  SET_CITY_FILTERS = 'SET_CITY_FILTERS',
  RECEIVE_CITY_FILTERS = 'RECEIVE_CITY_FILTERS'
}

export type FiltersActions = ReturnType<typeof setCityFilters> | ReturnType<typeof receiveCityFilters>;
