import axios from 'axios';

import { TCityFields } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { startLoading, endLoading } from 'actions';
import { handleApiErrors, handleApiResponse } from './utils';

export const RECEIVE_ADMIN_CITY = 'RECEIVE_ADMIN_CITY';

export const receiveAdminCity = (cityId: string, city: TCityFields) => ({
  type: RECEIVE_ADMIN_CITY,
  cityId,
  city,
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
