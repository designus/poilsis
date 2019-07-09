import axios from 'axios';

import { ITypeFields, TTypeFields } from 'global-utils';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { setAcceptLanguageHeader } from 'client-utils/methods';
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
import { receiveAdminType } from './admin';
import { config } from '../../../../config';

export const SELECT_TYPE = 'SELECT_TYPE';
export const RECEIVE_CLIENT_TYPE = 'RECEIVE_CLIENT_TYPE';
export const REMOVE_TYPE = 'REMOVE_TYPE';

export const selectType = (typeId) => ({
  type: SELECT_TYPE,
  typeId
});

export const receiveClientType = (newType: ITypeFields) => ({
  type: RECEIVE_CLIENT_TYPE,
  newType
});

export const removeType = (typeId) => ({
  type: REMOVE_TYPE,
  typeId
});

export const createType = (adminType: TTypeFields) => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post(`${config.host}/api/types`, adminType, setAcceptLanguageHeader(getLocale(getState())))
    .then(handleApiResponse)
    .then((clientType: ITypeFields) => {
      dispatch(receiveClientType(clientType));
      dispatch(stopLoading(false, TYPE_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(clientType);
    })
    .catch(handleApiErrors(TYPE_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateType = (adminType: TTypeFields) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`${config.host}/api/types/type/${adminType.id}`, adminType, setAcceptLanguageHeader())
    .then(handleApiResponse)
    .then((clientType: ITypeFields) => {
      dispatch(receiveClientType(clientType));
      dispatch(receiveAdminType(adminType.id, adminType));
      dispatch(stopLoading(false, TYPE_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(clientType);
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
