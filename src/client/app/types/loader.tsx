import { startLoading, endLoading } from 'actions/loader';

export interface ILoadingState {
  content: boolean;
  dialog: boolean;
  global: boolean;
}

export enum LoaderActionTypes {
  START_LOADING = 'START_LOADING',
  END_LOADING = 'END_LOADING'
}

export type LoaderType = 'content' | 'dialog' | 'global';

export type LoaderActions = ReturnType<typeof startLoading> | ReturnType<typeof endLoading>;
