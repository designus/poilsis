import { receiveInitialData, clearAllData } from 'actions/initialData';
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

export type InitialDataActions = ReturnType<typeof receiveInitialData> | ReturnType<typeof clearAllData>;
