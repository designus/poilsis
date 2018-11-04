import axios from 'axios';

import { TCityFields } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { startLoading, endLoading } from 'actions';
import { handleApiErrors, handleApiResponse } from './utils';

export const RECEIVE_LOADED_CITY = 'RECEIVE_LOADED_CITY';

export const receiveLoadedCity = (city: TCityFields) => ({
  type: RECEIVE_LOADED_CITY,
  city,
});

export const loadCity = (cityId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`http://localhost:3000/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then((city: TCityFields) => {
      dispatch(endLoading(CONTENT_LOADER_ID));
      dispatch(receiveLoadedCity(city));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};
