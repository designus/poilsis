import { ICity } from 'global-utils/typings';
import { receiveCity, removeCity, toggleCityEnabledField, setCityItems } from 'actions/cities';
import { IGenericDataMap, IGenericState } from './generic';

export type CitiesMap = IGenericDataMap<ICity>;

export interface ICityState extends IGenericState<ICity> {}

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
