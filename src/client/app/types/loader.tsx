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

export interface IStartLoading {
  type: LoaderActionTypes.START_LOADING;
  loaderId: LoaderType;
}

export interface IEndLoading {
  type: LoaderActionTypes.END_LOADING;
  loaderId: LoaderType;
}

export type LoaderActions = IStartLoading | IEndLoading;
