import axios from 'axios';

import { TCityFields, TTypeFields, TItemFields } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { startLoading, endLoading } from 'actions';
import { handleApiErrors, handleApiResponse } from './utils';

export const RECEIVE_ADMIN_CITY = 'RECEIVE_ADMIN_CITY';
export const RECEIVE_ADMIN_TYPE = 'RECEIVE_ADMIN_TYPE';
export const RECEIVE_ADMIN_ITEM = 'RECEIVE_ADMIN_ITEM';

export const receiveAdminCity = (cityId: string, adminCity: TCityFields) => ({
  type: RECEIVE_ADMIN_CITY,
  cityId,
  adminCity,
});

export const receiveAdminType = (typeId: string, adminType: TTypeFields) => ({
  type: RECEIVE_ADMIN_TYPE,
  typeId,
  adminType,
});

export const receiveAdminItem = (itemId: string, adminItem: TItemFields) => ({
  type: RECEIVE_ADMIN_ITEM,
  itemId,
  adminItem,
});

export const getAdminCity = (cityId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`http://localhost:3000/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then((adminCity: TCityFields) => {
      dispatch(endLoading(CONTENT_LOADER_ID));
      dispatch(receiveAdminCity(adminCity.id, adminCity));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};

export const getAdminType = (typeId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`http://localhost:3000/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then((adminType: TTypeFields) => {
      dispatch(endLoading(CONTENT_LOADER_ID));
      dispatch(receiveAdminType(adminType.id, adminType));
    })
    .catch(handleApiErrors('Unable to load type', CONTENT_LOADER_ID, dispatch));
};

export const getAdminItem = (itemId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`http://localhost:3000/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then((adminItem: TItemFields) => {
      dispatch(endLoading(CONTENT_LOADER_ID));
      dispatch(receiveAdminItem(adminItem.id, adminItem));
    })
    .catch(handleApiErrors('Unable to load Item', CONTENT_LOADER_ID, dispatch));
};
