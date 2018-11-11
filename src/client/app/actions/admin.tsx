import axios from 'axios';

import { TCityFields, TTypeFields } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { startLoading, endLoading } from 'actions';
import { handleApiErrors, handleApiResponse } from './utils';

export const RECEIVE_ADMIN_CITY = 'RECEIVE_ADMIN_CITY';
export const RECEIVE_ADMIN_TYPE = 'RECEIVE_ADMIN_TYPE';

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
