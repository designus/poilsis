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

import { stopLoading, handleApiErrors, handleApiResponse } from './utils';
import { startLoading } from './loader';
import { config } from '../../../../config';

export enum TypesActionTypes {
  SELECT_TYPE = 'SELECT_TYPE',
  RECEIVE_TYPE = 'RECEIVE_TYPE',
  REMOVE_TYPE = 'REMOVE_TYPE'
}

interface ISelectType {
  type: TypesActionTypes.SELECT_TYPE;
  typeId: string;
}

interface IReceiveType {
  type: TypesActionTypes.RECEIVE_TYPE;
  newType: IType;
}

interface IRemoveType {
  type: TypesActionTypes.REMOVE_TYPE;
  typeId: string;
}

export type TypesActions =
  | ISelectType
  | IReceiveType
  | IRemoveType;

export const selectType = (typeId: string): ISelectType => ({
  type: TypesActionTypes.SELECT_TYPE,
  typeId
});

export const receiveType = (newType: IType): IReceiveType => ({
  type: TypesActionTypes.RECEIVE_TYPE,
  newType
});

export const removeType = (typeId: string): IRemoveType => ({
  type: TypesActionTypes.REMOVE_TYPE,
  typeId
});

export const createType = (type: IType) => (dispatch) => {
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
