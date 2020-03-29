import { Price } from 'global-utils/typings';
import { setCityFilters, receiveCityFilters, setTypeFilter, setPriceFilter } from 'actions/filters';

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
  RECEIVE_CITY_FILTERS = 'RECEIVE_CITY_FILTERS',
  SET_TYPE_FILTER = 'SET_TYPE_FILTER',
  SET_PRICE_FILTER = 'SET_PRICE_FILTER'
}

export type FiltersActions =
  | ReturnType<typeof setCityFilters>
  | ReturnType<typeof receiveCityFilters>
  | ReturnType<typeof setTypeFilter>
  | ReturnType<typeof setPriceFilter>;
