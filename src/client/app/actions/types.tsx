import axios, { AxiosResponse as IResponse } from 'axios';

import { ITypeFields } from 'global-utils';
import { startLoading } from './loader';
import { stopLoading } from './items';
import { CONTENT_LOADER_ID, handleApiResponse } from '../client-utils';
import { TYPE_CREATE_SUCCESS, TYPE_CREATE_ERROR, TYPE_UPDATE_ERROR, TYPE_UPDATE_SUCCESS } from 'data-strings';

export const SELECT_TYPE = 'SELECT_TYPE';
export const RECEIVE_TYPE = 'RECEIVE_TYPE';
export const REMOVE_TYPE = 'REMOVE_TYPE';

export const selectType = (typeId) => ({
  type: SELECT_TYPE,
  typeId,
});

export const receiveType = (newType: ITypeFields) => ({
  type: RECEIVE_TYPE,
  newType,
});

const handleTypeErrors = (message, dispatch) => err => {
  console.error(err);
  dispatch(stopLoading(true, message, CONTENT_LOADER_ID));
  return Promise.reject(err);
};

export const createType = (type: ITypeFields) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post('http://localhost:3000/api/types', type)
    .then(handleApiResponse)
    .then(type => {
      dispatch(receiveType(type));
      dispatch(stopLoading(false, TYPE_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(type);
    })
    .catch(handleTypeErrors(TYPE_CREATE_ERROR, dispatch));
};

export const updateType = (type: ITypeFields) => async (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`http://localhost:3000/api/types/type/${type.id}`, type)
    .then(handleApiResponse)
    .then(type => {
      dispatch(receiveType(type));
      dispatch(stopLoading(false, TYPE_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(type);
    })
    .catch(handleTypeErrors(TYPE_UPDATE_ERROR, dispatch));

};

export const deleteType = (typeId: string) => (dispatch) => {
  console.log('Delete type');
};
