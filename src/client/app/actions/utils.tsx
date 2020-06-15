import axios, { AxiosResponse, AxiosRequestConfig, AxiosPromise } from 'axios';
import { config } from 'config';
import { Toast, ThunkResult, ThunkDispatch, LoaderType, GraphqlResponse } from 'types';
import { graphqlFetchOptions } from 'client-utils/methods';
import { showToast } from './toast';
import { endLoading, hideLoader } from './loader';

export const http = axios.create({
  baseURL: config.host
});

export function gqlRequest<T>(operation: any, additionalParameters: AxiosRequestConfig = {}): AxiosPromise<GraphqlResponse<T>> {
  return axios.create({ baseURL: config.host })({ ...graphqlFetchOptions(operation), ...additionalParameters });
}

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
  return response.data;
}

export function handleGraphqlResponse<T>(response: AxiosResponse<GraphqlResponse<T>>) {
  return response.data.data;
}
