import axios from 'axios';

import { ITypeFields } from 'global-utils';
import { startLoading } from './loader';
import { stopLoading } from './items';
import { CONTENT_LOADER_ID, handleApiResponse, DIALOG_LOADER_ID } from '../client-utils';
import {
  TYPE_CREATE_SUCCESS,
  TYPE_UPDATE_SUCCESS,
  TYPE_DELETE_SUCCESS,
  TYPE_CREATE_ERROR,
  TYPE_UPDATE_ERROR,
  TYPE_DELETE_ERROR,
} from 'data-strings';

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

export const removeType = (typeId) => ({
  type: REMOVE_TYPE,
  typeId,
});

const handleTypeErrors = (message, loaderId, dispatch) => err => {
  console.error(err);
  dispatch(stopLoading(true, message, loaderId));
  return Promise.reject(err);
};

export const createType = (type: ITypeFields) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post('http://localhost:3000/api/types', type)
    .then(handleApiResponse)
    .then(type => {
      dispatch(receiveType(type));
      dispatch(stopLoading(false, TYPE_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(type);
    })
    .catch(handleTypeErrors(TYPE_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateType = (type: ITypeFields) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`http://localhost:3000/api/types/type/${type.id}`, type)
    .then(handleApiResponse)
    .then(type => {
      dispatch(receiveType(type));
      dispatch(stopLoading(false, TYPE_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(type);
    })
    .catch(handleTypeErrors(TYPE_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteType = (typeId: string) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return axios.delete(`http://localhost:3000/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then(() => {
      dispatch(removeType(typeId));
      dispatch(stopLoading(false, TYPE_DELETE_SUCCESS, DIALOG_LOADER_ID));
      return Promise.resolve();
    })
    .catch(handleTypeErrors(TYPE_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};
