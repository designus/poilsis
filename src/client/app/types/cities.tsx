import { City } from 'global-utils/data-models';
import { receiveCity, removeCity, toggleCityEnabledField, setCityItems } from 'actions/cities';
import { IGenericDataMap, IGenericState } from './generic';

export type CitiesMap = IGenericDataMap<City>;

export interface ICityState extends IGenericState<City> {}

export enum CitiesActionTypes {
  RECEIVE_CITY = 'RECEIVE_CITY',
  REMOVE_CITY = 'REMOVE_CITY',
  SET_CITY_ITEMS = 'SET_CITY_ITEMS',
  TOGGLE_CITY_ENABLED = 'TOGGLE_CITY_ENABLED'
}

export type CitiesActions =
  | ReturnType<typeof receiveCity>
  | ReturnType<typeof removeCity>
  | ReturnType<typeof toggleCityEnabledField>
  | ReturnType<typeof setCityItems>;
