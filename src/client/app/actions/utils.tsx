import axios, { AxiosResponse as IResponse } from 'axios';
import { config } from 'config';
import { Toast } from 'types';

import { showToast } from './toast';
import { endLoading } from './loader';

export const http = axios.create({
  baseURL: config.host
});

export const stopLoading = (isError, toastMessage, loaderId) => dispatch => {
  const toastType = isError ? Toast.error : Toast.success;
  dispatch(endLoading(loaderId));
  dispatch(showToast(toastType, toastMessage));
};

export const handleApiErrors = (message, loaderId, dispatch) => err => {
  console.error(err);
  dispatch(stopLoading(true, message, loaderId));
  return Promise.reject(err);
};

export const handleApiResponse = (response: IResponse) => {
  if (response.data.errors) {
    throw response.data.errors;
  }

  if (response.data.errmsg) {
    throw response.data.errmsg;
  }

  return response.data;
};
