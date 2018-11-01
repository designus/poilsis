import axios from 'axios';

import { ICityFields } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { startLoading, endLoading } from 'actions';
import { handleApiErrors, handleApiResponse } from './utils';

export const RECEIVE_ADMIN_CITY = 'RECEIVE_ADMIN_CITY';

export const receiveAdminCity = (city: ICityFields) => ({
  type: RECEIVE_ADMIN_CITY,
  city,
});

export const getAdminCity = (cityId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`http://localhost:3000/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then((city: ICityFields) => {
      dispatch(endLoading(CONTENT_LOADER_ID));
      dispatch(receiveAdminCity(city));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};
