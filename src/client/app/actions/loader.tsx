import { LoaderActionTypes, IStartLoading, IEndLoading } from 'types';

export const startLoading = (loaderId: string): IStartLoading => ({
  type: LoaderActionTypes.START_LOADING,
  loaderId
});

export const endLoading = (loaderId: string): IEndLoading => ({
  type: LoaderActionTypes.END_LOADING,
  loaderId
});
