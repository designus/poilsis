import axios from 'axios';

import { IType } from 'global-utils';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import {
  TYPE_CREATE_SUCCESS,
  TYPE_UPDATE_SUCCESS,
  TYPE_DELETE_SUCCESS,
  TYPE_CREATE_ERROR,
  TYPE_UPDATE_ERROR,
  TYPE_DELETE_ERROR
} from 'data-strings';
import { getLocale } from 'selectors';

import { stopLoading, handleApiErrors, handleApiResponse } from './utils';
import { startLoading } from './loader';
import { config } from '../../../../config';

export const SELECT_TYPE = 'SELECT_TYPE';
export const RECEIVE_TYPE = 'RECEIVE_TYPE';
export const REMOVE_TYPE = 'REMOVE_TYPE';

export const selectType = (typeId) => ({
  type: SELECT_TYPE,
  typeId
});

export const receiveType = (newType: IType) => ({
  type: RECEIVE_TYPE,
  newType
});

export const removeType = (typeId) => ({
  type: REMOVE_TYPE,
  typeId
});

export const createType = (type: IType) => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post(`${config.host}/api/types`, type)
    .then(handleApiResponse)
    .then((response: IType) => {
      dispatch(receiveType(response));
      dispatch(stopLoading(false, TYPE_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(TYPE_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateType = (adminType: IType) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`${config.host}/api/types/type/${adminType.id}`, adminType)
    .then(handleApiResponse)
    .then((response: IType) => {
      dispatch(receiveType(response));
      dispatch(stopLoading(false, TYPE_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(TYPE_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteType = (typeId: string) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return axios.delete(`${config.host}/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then(() => {
      dispatch(removeType(typeId));
      dispatch(stopLoading(false, TYPE_DELETE_SUCCESS, DIALOG_LOADER_ID));
      return Promise.resolve();
    })
    .catch(handleApiErrors(TYPE_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};
