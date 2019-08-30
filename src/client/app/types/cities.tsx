import { ICity } from 'global-utils/typings';
import { IGenericDataMap, IGenericState } from './generic';

export type ICitiesMap = IGenericDataMap<ICity>;
export interface ICityLocalized extends ICity<string> {}
export interface ICityState extends IGenericState<ICity> {
  selectedId?: string;
}

export enum CitiesActionTypes {
  SELECT_CITY = 'SELECT_CITY',
  CLEAR_SELECTED_CITY = 'CLEAR_SELECTED_CITY',
  RECEIVE_CITY = 'RECEIVE_CITY',
  REMOVE_CITY = 'REMOVE_CITY'
}

export interface ISelectCity {
  type: CitiesActionTypes.SELECT_CITY;
  cityId: string;
}

export interface IClearSelectedCity {
  type: CitiesActionTypes.CLEAR_SELECTED_CITY;
}

export interface IReceiveCity {
  type: CitiesActionTypes.RECEIVE_CITY;
  city: ICity;
}

export interface IRemoveCity {
  type: CitiesActionTypes.REMOVE_CITY;
  cityId: string;
}

export type CitiesActions =
  | ISelectCity
  | IClearSelectedCity
  | IReceiveCity
  | IRemoveCity;
