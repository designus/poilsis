
import { ICityState } from './cities';
import { ITypesState } from './types';
import { IUsersState } from './users';

export interface IInitialDataState {
  isLoaded: boolean;
  isMultiLang: boolean;
}

export enum InitialDataActionTypes {
  RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA',
  CLEAR_ALL_DATA = 'CLEAR_ALL_DATA'
}

export interface IReceiveInitialData {
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA;
  cities: ICityState;
  types: ITypesState;
  users: Partial<IUsersState>;
  isLoggedIn: boolean;
}

export interface IClearAllData {
  type: InitialDataActionTypes.CLEAR_ALL_DATA;
}

export type InitialDataActions = IReceiveInitialData | IClearAllData;
