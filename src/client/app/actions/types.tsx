import axios from 'axios';

import { ITypeFields } from 'global-utils';
import { startLoading } from './loader';
import { stopLoading } from './items';
import { CONTENT_LOADER_ID } from '../client-utils';
import { TYPE_CREATE_SUCCESS, TYPE_CREATE_ERROR } from 'data-strings';

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

export const createType = (type: ITypeFields) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.post('http://localhost:3000/api/types', type)
      .then(response => response.data)
      .then(type => {
        if (type.errors) {
          stopLoading(true, TYPE_CREATE_ERROR, CONTENT_LOADER_ID);
          reject(type.errors);
        } else {
          dispatch(receiveType(type));
          dispatch(stopLoading(false, TYPE_CREATE_SUCCESS, CONTENT_LOADER_ID));
          resolve(type);
        }
      })
      .catch(err => {
        console.error(err);
        stopLoading(true, TYPE_CREATE_ERROR, CONTENT_LOADER_ID);
      });
  });
};

export const updateType = (type: ITypeFields) => (dispatch) => {
  console.log('Update type');
};

export const deleteType = (typeId: string) => (dispatch) => {
  console.log('Delete type');
};
