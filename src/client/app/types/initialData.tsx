import { ICityState } from './cities';
import { ITypesState } from './types';

export interface IInitialData {
  cities: ICityState;
  types: ITypesState;
}

export interface IInitialDataState {
  isLoaded: boolean;
}

export enum InitialDataActionTypes {
  RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA',
  CLEAR_ALL_DATA = 'CLEAR_ALL_DATA'
}

export interface IReceiveInitialData {
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA;
  data: IInitialData;
}

export interface IClearAllData {
  type: InitialDataActionTypes.CLEAR_ALL_DATA;
}

export type InitialDataActions = IReceiveInitialData | IClearAllData;
