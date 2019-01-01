import axios from 'axios';

import { ICityFields, TCityFields, IItemFields } from 'global-utils';
import { IAppState } from 'reducers';
import { startLoading, endLoading, receiveItems } from 'actions';
import {
  CITY_CREATE_SUCCESS,
  CITY_CREATE_ERROR,
  CITY_UPDATE_SUCCESS,
  CITY_UPDATE_ERROR,
  CITY_DELETE_SUCCESS,
  CITY_DELETE_ERROR,
} from 'data-strings';
import { getLocale, getSelectedCity } from 'selectors';
import { getNormalizedData, setAcceptLanguageHeader, CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils';
import { stopLoading, handleApiErrors, handleApiResponse } from './utils';
import { receiveAdminCity } from './admin';

export const SELECT_CITY = 'SELECT_CITY';
export const RECEIVE_CLIENT_CITY = 'RECEIVE_CLIENT_CITY';
export const REMOVE_CITY = 'REMOVE_CITY';

export const selectCity = (cityId: string) => ({
  type: SELECT_CITY,
  cityId,
});

export const receiveClientCity = (newCity: ICityFields) => ({
  type: RECEIVE_CLIENT_CITY,
  newCity,
});

export const removeCity = (cityId: string) => ({
  type: REMOVE_CITY,
  cityId,
});

export const loadCityItems = (cityId: string, locale: string) => {
  return (dispatch, getState) => {

    const state: IAppState = getState();
    const selectedCity = getSelectedCity(state);
    const items = state.items;
    const language = locale || getLocale(state);

    if (items.hasAllItems || selectedCity.hasItems) {
      return;
    }

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.get(
      `http://localhost:3000/api/items/city/${cityId}`,
      setAcceptLanguageHeader(language),
    )
      .then(response => response.data)
      .then((data: IItemFields[]) => {

        const filteredData = data.filter(item => !items.dataMap[item.id]);
        const { dataMap, aliases } = getNormalizedData(filteredData);

        dispatch(receiveItems({ dataMap, aliases, cityId }));
        dispatch(endLoading(CONTENT_LOADER_ID));

      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
  };
};

export const createCity = (adminCity: TCityFields) => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post('http://localhost:3000/api/cities', adminCity, setAcceptLanguageHeader(getLocale(getState())))
    .then(handleApiResponse)
    .then((clientCity: ICityFields) => {
      dispatch(receiveClientCity(clientCity));
      dispatch(stopLoading(false, CITY_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(clientCity);
    })
    .catch(handleApiErrors(CITY_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateCity = (adminCity: TCityFields) => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(
    `http://localhost:3000/api/cities/city/${adminCity.id}`,
     adminCity,
     setAcceptLanguageHeader(getLocale(getState)),
  )
    .then(handleApiResponse)
    .then((clientCity: ICityFields) => {
      dispatch(receiveClientCity(clientCity));
      dispatch(receiveAdminCity(clientCity.id, adminCity));
      dispatch(stopLoading(false, CITY_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(clientCity);
    })
    .catch(handleApiErrors(CITY_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteCity = (cityId: string) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return axios.delete(`http://localhost:3000/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then(() => {
      dispatch(removeCity(cityId));
      dispatch(stopLoading(false, CITY_DELETE_SUCCESS, DIALOG_LOADER_ID));
      return Promise.resolve();
    })
    .catch(handleApiErrors(CITY_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};
