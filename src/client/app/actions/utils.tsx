import axios, { AxiosResponse } from 'axios';
import { config } from 'config';
import { Toast, ThunkResult, ThunkDispatch, LoaderType } from 'types';

import { showToast } from './toast';
import { endLoading, hideLoader } from './loader';

export const http = axios.create({
  baseURL: config.host
});

export const stopLoading = (isError: boolean, toastMessage: string, loaderId: LoaderType) => (dispatch: ThunkDispatch) => {
  const toastType = isError ? Toast.error : Toast.success;
  dispatch(endLoading(loaderId));
  dispatch(showToast(toastType, toastMessage));
};

export const handleApiErrors = (message: string, loaderId: LoaderType, dispatch: ThunkDispatch) => (err: string) => {
  console.error(err);
  dispatch(hideLoader(loaderId));
  dispatch(showToast(Toast.error, message));
  return Promise.reject(err);
};

export function handleApiResponse<T>(response: AxiosResponse<T>): T {
  // if (response.data.errors) {
  //   throw response.data.errors;
  // }
  return response.data;
}
