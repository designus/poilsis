import axios from 'axios';

import { ICity, IItem } from 'global-utils';
import { IAppState } from 'reducers';
import { startLoading, endLoading } from 'actions/loader';
import { receiveUniqueItems } from 'actions/items';
import {
  CITY_CREATE_SUCCESS,
  CITY_CREATE_ERROR,
  CITY_UPDATE_SUCCESS,
  CITY_UPDATE_ERROR,
  CITY_DELETE_SUCCESS,
  CITY_DELETE_ERROR
} from 'data-strings';
import { getCityByAlias } from 'selectors';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { stopLoading, handleApiErrors, handleApiResponse } from './utils';
import { config } from '../../../../config';

export const SELECT_CITY = 'SELECT_CITY';
export const CLEAR_SELECTED_CITY = 'CLEAR_SELECTED_CITY';
export const RECEIVE_CITY = 'RECEIVE_CITY';
export const REMOVE_CITY = 'REMOVE_CITY';

export const selectCity = (cityId: string) => ({
  type: SELECT_CITY,
  cityId
});

export const clearSelectedCity = () => ({
  type: CLEAR_SELECTED_CITY
});

export const receiveCity = (newCity: ICity) => ({
  type: RECEIVE_CITY,
  newCity
});

export const removeCity = (cityId: string) => ({
  type: REMOVE_CITY,
  cityId
});

export const loadCityItems = (cityAlias: string) => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const city = getCityByAlias(state, cityAlias);

    if (!city) {
      return null;
    }

    const cityId = city.id;

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.get(`${config.host}/api/items/city/${cityId}`)
      .then(handleApiResponse)
      .then((data: IItem[]) => {
        dispatch(receiveUniqueItems(data, { cityId }));
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
  };
};

export const createCity = (city: ICity) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post(`${config.host}/api/cities`, city)
    .then(handleApiResponse)
    .then((response: ICity) => {
      dispatch(receiveCity(response));
      dispatch(stopLoading(false, CITY_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(CITY_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateCity = (city: ICity) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`${config.host}/api/cities/city/${city.id}`, city)
    .then(handleApiResponse)
    .then((response: ICity) => {
      dispatch(receiveCity(response));
      dispatch(stopLoading(false, CITY_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(CITY_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteCity = (cityId: string) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return axios.delete(`${config.host}/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then(() => {
      dispatch(removeCity(cityId));
      dispatch(stopLoading(false, CITY_DELETE_SUCCESS, DIALOG_LOADER_ID));
      return Promise.resolve();
    })
    .catch(handleApiErrors(CITY_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};
