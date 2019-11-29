import { ICity, IItem } from 'global-utils';
import { startLoading, endLoading } from 'actions/loader';
import { receiveNewItems } from 'actions/items';
import { showToast } from 'actions/toast';
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
import { IAppState, CitiesActionTypes, IReceiveCity, IRemoveCity, ToggleEnabledParams, IToggleEnabled, Toast } from 'types';

import { stopLoading, handleApiErrors, handleApiResponse, http } from './utils';

export const receiveCity = (city: ICity): IReceiveCity => ({
  type: CitiesActionTypes.RECEIVE_CITY,
  city
});

export const removeCity = (cityId: string): IRemoveCity => ({
  type: CitiesActionTypes.REMOVE_CITY,
  cityId
});

export const toggleCityEnabledField = (params: ToggleEnabledParams): IToggleEnabled => ({
  type: CitiesActionTypes.TOGGLE_CITY_ENABLED,
  ...params
});

export const loadCityItems = (alias: string) => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const city = getCityByAlias(state, alias);

    if (!city) {
      return null;
    }

    const cityId = city.id;

    dispatch(startLoading(CONTENT_LOADER_ID));

    return http.get(`/api/items/city/${cityId}`)
      .then(handleApiResponse)
      .then((data: IItem[]) => {
        dispatch(receiveNewItems(data, { cityId, dataType: 'cities' }));
        dispatch(endLoading(CONTENT_LOADER_ID));
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
  };
};

export const createCity = (city: ICity) => (dispatch): Promise<ICity> => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.post('/api/cities', city)
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

  return http.put(`/api/cities/city/${city.id}`, city)
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
  return http.delete(`/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then(() => {
      dispatch(removeCity(cityId));
      dispatch(stopLoading(false, CITY_DELETE_SUCCESS, DIALOG_LOADER_ID));
      return Promise.resolve();
    })
    .catch(handleApiErrors(CITY_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleCityEnabled = (params: ToggleEnabledParams) => (dispatch) => {
  return http.patch(`/api/cities/city/toggle-enabled`, params)
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleCityEnabledField(params));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.city.enable_error'));
    });
};
