import axios from 'axios';

import { ICityFields, TCityFields } from 'global-utils';
import { ICitiesItems, IAppState } from 'reducers';
import { startLoading, endLoading, receiveItems } from 'actions';
import {
  CITY_CREATE_SUCCESS,
  CITY_CREATE_ERROR,
  CITY_UPDATE_SUCCESS,
  CITY_UPDATE_ERROR,
  CITY_DELETE_SUCCESS,
  CITY_DELETE_ERROR,
} from 'data-strings';
import { getLocale } from 'selectors';
import { getNormalizedData, setAcceptLanguageHeader, CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils';
import { stopLoading, handleApiErrors, handleApiResponse } from './utils';
import { receiveAdminCity } from './admin';

export const SELECT_CITY = 'SELECT_CITY';
export const RECEIVE_CITY_ITEMS = 'RECEIVE_CITY_ITEMS';
export const ADD_CITY_ITEM = 'ADD_CITY_ITEM';
export const REMOVE_CITY_ITEM = 'REMOVE_CITY_ITEM';
export const RECEIVE_CLIENT_CITY = 'RECEIVE_CLIENT_CITY';
export const REMOVE_CITY = 'REMOVE_CITY';

export const selectCity = (cityId: string) => ({
  type: SELECT_CITY,
  cityId,
});

export const receiveCityItems = (items: ICitiesItems) => ({
  type: RECEIVE_CITY_ITEMS,
  items,
});

export const removeCityItem = (cityId: string, itemId: string) => ({
  type: REMOVE_CITY_ITEM,
  cityId,
  itemId,
});

export const addCityItem = (cityId: string, itemId: string) => ({
  type: ADD_CITY_ITEM,
  cityId,
  itemId,
});

export const receiveClientCity = (newCity: ICityFields) => ({
  type: RECEIVE_CLIENT_CITY,
  newCity,
});

export const removeCity = (cityId: string) => ({
  type: REMOVE_CITY,
  cityId,
});

export const getCityItems = (cityId: string, locale: string) => {
  return (dispatch, getState) => {

    const state: IAppState = getState();
    const selectedCity = state.cities.dataMap[cityId];
    const items = state.items;
    const haveAllItemsLoaded = items.isAllLoaded;
    const haveAllCityItemsLoaded = selectedCity.haveAllItemsLoaded;
    const language = locale || getLocale(state);

    dispatch(selectCity(cityId));

    if (!selectedCity || haveAllItemsLoaded || haveAllCityItemsLoaded) {
      return;
    }

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.get(
      `http://localhost:3000/api/items/city/${cityId}`,
      setAcceptLanguageHeader(language),
    )
      .then(response => response.data)
      .then(data => {

        const { dataMap: itemsMap, aliases } = getNormalizedData(data);
        const areAllItemsLoaded = false;
        const cityItems = {
          [cityId]: {
            items: Object.keys(itemsMap),
            haveAllItemsLoaded: true,
          },
        };

        dispatch(receiveItems(itemsMap, aliases, areAllItemsLoaded));
        dispatch(receiveCityItems(cityItems));
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
