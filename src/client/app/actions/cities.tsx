import { batch } from 'react-redux';
import { ICity, IItem } from 'global-utils';
import { startLoading, endLoading } from 'actions/loader';
import { showToast } from 'actions/toast';
import { receiveItems } from 'actions/items';
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
import { getNewItems, getNormalizedData } from 'client-utils/methods';
import {
  IAppState,
  CitiesActionTypes,
  IReceiveCity,
  IRemoveCity,
  ToggleEnabledParams,
  IToggleEnabled,
  Toast,
  ThunkDispatch,
  ThunkResult,
  IReceiveCityItems
} from 'types';

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

export const receiveCityItems = (cityId: string): IReceiveCityItems => ({
  type: CitiesActionTypes.RECEIVE_CITY_ITEMS,
  cityId
});

export const loadCityItems = (alias: string): ThunkResult<Promise<void>> => (dispatch, getState) => {
  const state = getState();
  const city = getCityByAlias(state, alias);

  if (!city) {
    return null;
  }

  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.get<IItem[]>(`/api/items/city/${city.id}`)
    .then(response => handleApiResponse(response))
    .then((items) => {
      const newItems = getNewItems(items, state);
      const data = getNormalizedData(newItems);
      batch(() => {
        dispatch(receiveItems(data));
        dispatch(receiveCityItems(city.id));
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const createCity = (city: ICity): ThunkResult<Promise<ICity>> => (dispatch: ThunkDispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.post<ICity>('/api/cities', city)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveCity(response));
      dispatch(stopLoading(false, CITY_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(CITY_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateCity = (city: ICity): ThunkResult<Promise<ICity>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.put<ICity>(`/api/cities/city/${city.id}`, city)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveCity(response));
      dispatch(stopLoading(false, CITY_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return response;
    })
    .catch(handleApiErrors(CITY_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteCity = (cityId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return http.delete(`/api/cities/city/${cityId}`)
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(removeCity(cityId));
      dispatch(stopLoading(false, CITY_DELETE_SUCCESS, DIALOG_LOADER_ID));
    })
    .catch(handleApiErrors(CITY_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleCityEnabled = (params: ToggleEnabledParams): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/cities/city/toggle-enabled`, params)
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleCityEnabledField(params));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.city.enable_error'));
    });
};
