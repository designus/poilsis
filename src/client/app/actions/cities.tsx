import axios from 'axios';

import { ICitiesItems, IAppState } from '../reducers';
import { startLoading, endLoading, receiveItems } from '../actions';
import { getNormalizedData, CONTENT_LOADER_ID } from '../client-utils';

export const SELECT_CITY = 'SELECT_CITY';
export const RECEIVE_CITY_ITEMS = 'RECEIVE_CITY_ITEMS';
export const ADD_CITY_ITEM = 'ADD_CITY_ITEM';
export const REMOVE_CITY_ITEM = 'REMOVE_CITY_ITEM';

export const selectCity = (cityId) => {
  return {
    type: SELECT_CITY,
    cityId,
  };
};

export const receiveCityItems = (items: ICitiesItems) => {
  return {
    type: RECEIVE_CITY_ITEMS,
    items,
  };
};

export const removeCityItem = (cityId, itemId) => {
  return {
    type: REMOVE_CITY_ITEM,
    cityId,
    itemId,
  };
};

export const addCityItem = (cityId, itemId) => {
  return {
    type: ADD_CITY_ITEM,
    cityId,
    itemId,
  };
};

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
