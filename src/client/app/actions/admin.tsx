import axios from 'axios';

import { config } from '../../../../config';
import { TCityFields, TTypeFields, TItemFields, TItemDescFields } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { startLoading, endLoading } from 'actions';
import { handleApiErrors, handleApiResponse } from './utils';

export const RECEIVE_ADMIN_CITY = 'RECEIVE_ADMIN_CITY';
export const RECEIVE_ADMIN_TYPE = 'RECEIVE_ADMIN_TYPE';
export const RECEIVE_ADMIN_ITEM = 'RECEIVE_ADMIN_ITEM';
export const RECEIVE_ADMIN_ITEM_DESCRIPTION = 'RECEIVE_ADMIN_ITEM_DESCRIPTION';

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

export const receiveAdminItemDesc = (itemId: string, descFields: TItemDescFields) => ({
  type: RECEIVE_ADMIN_ITEM_DESCRIPTION,
  itemId,
  descFields,
});

export const getAdminCity = (cityId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then((adminCity: TCityFields) => {
      dispatch(receiveAdminCity(adminCity.id, adminCity));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};

export const getAdminType = (typeId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then((adminType: TTypeFields) => {
      dispatch(receiveAdminType(adminType.id, adminType));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load type', CONTENT_LOADER_ID, dispatch));
};

export const getAdminItem = (itemId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then((adminItem: TItemFields) => {
      dispatch(receiveAdminItem(adminItem.id, adminItem));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load Item', CONTENT_LOADER_ID, dispatch));
};
