import axios from 'axios';

import { ICityFields } from 'global-utils';
import { ICitiesItems, IAppState } from 'reducers';
import { startLoading, endLoading, receiveItems } from 'actions';
import { getNormalizedData, handleApiResponse, CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils';
import {
  CITY_CREATE_SUCCESS,
  CITY_UPDATE_SUCCESS,
  CITY_DELETE_SUCCESS,
  CITY_CREATE_ERROR,
  CITY_UPDATE_ERROR,
  CITY_DELETE_ERROR,
} from 'data-strings';
import { stopLoading, handleApiErrors } from './utils';

export const SELECT_CITY = 'SELECT_CITY';
export const RECEIVE_CITY_ITEMS = 'RECEIVE_CITY_ITEMS';
export const ADD_CITY_ITEM = 'ADD_CITY_ITEM';
export const REMOVE_CITY_ITEM = 'REMOVE_CITY_ITEM';
export const RECEIVE_CITY = 'RECEIVE_CITY';
export const REMOVE_CITY = 'REMOVE_CITY';

export const selectCity = (cityId) => ({
  type: SELECT_CITY,
  cityId,
});

export const receiveCityItems = (items: ICitiesItems) => ({
  type: RECEIVE_CITY_ITEMS,
  items,
});

export const removeCityItem = (cityId, itemId) => ({
  type: REMOVE_CITY_ITEM,
  cityId,
  itemId,
});

export const addCityItem = (cityId, itemId) => ({
  type: ADD_CITY_ITEM,
  cityId,
  itemId,
});

export const receiveCity = (newCity: ICityFields) => ({
  type: RECEIVE_CITY,
  newCity,
});

export const removeCity = (cityId) => ({
  type: REMOVE_CITY,
  cityId,
});

export const getCityItems = (cityId) => {
  return (dispatch, getState) => {

    const state: IAppState = getState();
    const selectedCity = state.cities.dataMap[cityId];
    const items = state.items;
    const haveAllItemsLoaded = items.isAllLoaded;
    const haveAllCityItemsLoaded = selectedCity.haveAllItemsLoaded;

    if (!selectedCity || haveAllItemsLoaded || haveAllCityItemsLoaded) {
      return;
    }

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.get(`http://localhost:3000/api/items/city/${cityId}`)
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

export const createCity = (city: ICityFields) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post('http://localhost:3000/api/cities', city)
    .then(handleApiResponse)
    .then((city: ICityFields) => {
      dispatch(receiveCity(city));
      dispatch(stopLoading(false, CITY_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(city);
    })
    .catch(handleApiErrors(CITY_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateCity = (city: ICityFields) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`http://localhost:3000/api/cities/city/${city.id}`, city)
    .then(handleApiResponse)
    .then((city: ICityFields) => {
      dispatch(receiveCity(city));
      dispatch(stopLoading(false, CITY_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(city);
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
