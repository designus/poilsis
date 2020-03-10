import { ICity, ICityFilters } from 'global-utils/typings';
import { IGenericDataMap, IGenericState, IToggleEnabled } from './generic';

export type CitiesMap = IGenericDataMap<ICity>;

export interface ICityState extends IGenericState<ICity> {}

export enum CitiesActionTypes {
  RECEIVE_CITY = 'RECEIVE_CITY',
  REMOVE_CITY = 'REMOVE_CITY',
  SET_CITY_ITEMS = 'SET_CITY_ITEMS',
  SET_CITY_FILTERS = 'SET_CITY_FILTERS',
  TOGGLE_CITY_ENABLED = 'TOGGLE_CITY_ENABLED'
}

export interface IReceiveCity {
  type: CitiesActionTypes.RECEIVE_CITY;
  city: ICity;
}

export interface IRemoveCity {
  type: CitiesActionTypes.REMOVE_CITY;
  cityId: string;
}

export interface ISetCityItems {
  type: CitiesActionTypes.SET_CITY_ITEMS;
  cityId: string;
}

export interface ISetCityFilters {
  type: CitiesActionTypes.SET_CITY_FILTERS;
  cityId: string;
  filters: ICityFilters;
}

export type CitiesActions =
  | IReceiveCity
  | IRemoveCity
  | IToggleEnabled
  | ISetCityItems
  | ISetCityFilters;
