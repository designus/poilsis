import { ICityState } from './cities';
import { ITypesState } from './types';
import { IUsersState } from './users';

export interface IInitialData {
  cities: ICityState;
  types: ITypesState;
  users: IUsersState;
}

export interface IInitialDataState {
  isLoaded: boolean;
}

export enum InitialDataActionTypes {
  RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA'
}

export interface IReceiveInitialData {
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA;
  data: IInitialData;
}

export type InitialDataActions = IReceiveInitialData;
