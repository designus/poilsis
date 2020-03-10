import { batch } from 'react-redux';
import { ICity, IItem } from 'global-utils';
import { showLoader, hideLoader } from 'actions/loader';
import { showToast } from 'actions/toast';
import { receiveItems } from 'actions/items';
import {
  CITY_CREATE_SUCCESS,
  CITY_CREATE_ERROR,
  CITY_UPDATE_SUCCESS,
  CITY_UPDATE_ERROR,
  CITY_DELETE_SUCCESS,
  CITY_DELETE_ERROR,
  CITY_LOAD_ERROR,
  CITY_ENABLE_ERROR
} from 'data-strings';
import { getCityByAlias } from 'selectors';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { getNewItems, getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import {
  CitiesActionTypes,
  IReceiveCity,
  IRemoveCity,
  ToggleEnabledParams,
  IToggleEnabled,
  Toast,
  ThunkDispatch,
  ThunkResult,
  ISetCityItems,
  ActionCreator,
  ISetCityFilters
} from 'types';

import { stopLoading, handleApiErrors, handleApiResponse, http } from './utils';

export const receiveCity: ActionCreator<IReceiveCity> = params => ({
  type: CitiesActionTypes.RECEIVE_CITY,
  ...params
});

export const removeCity: ActionCreator<IRemoveCity> = params => ({
  type: CitiesActionTypes.REMOVE_CITY,
  ...params
});

export const toggleCityEnabledField: ActionCreator<IToggleEnabled> = params => ({
  type: CitiesActionTypes.TOGGLE_CITY_ENABLED,
  ...params
});

export const setCityItems: ActionCreator<ISetCityItems> = params => ({
  type: CitiesActionTypes.SET_CITY_ITEMS,
  ...params
});

export const setCityFilters: ActionCreator<ISetCityFilters> = params => ({
  type: CitiesActionTypes.SET_CITY_FILTERS,
  ...params
});

export const getAdminCity = (cityId: string): ThunkResult<Promise<ICity>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.get<ICity>(`/api/cities/city/${cityId}`)
    .then(response => handleApiResponse(response))
    .then(city => {
      dispatch(receiveCity({ city }));
      dispatch(hideLoader(CONTENT_LOADER_ID));
      return city;
    })
    .catch(handleApiErrors(CITY_LOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const loadCityItems = (alias: string): ThunkResult<Promise<void> | null> => (dispatch, getState) => {
  const state = getState();
  const city = getCityByAlias(state, alias);

  if (!city) {
    return null;
  }

  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.get<IItem[]>(`/api/items/city/${city.id}`, setAcceptLanguageHeader(state.locale.client))
    .then(response => handleApiResponse(response))
    .then((items) => {
      const newItems = getNewItems(items, state);
      const data = getNormalizedData(newItems);
      batch(() => {
        dispatch(receiveItems(data));
        dispatch(setCityItems({ cityId: city.id }));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
};

export const createCity = (city: ICity): ThunkResult<Promise<ICity>> => (dispatch: ThunkDispatch) => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.post<ICity>('/api/cities', city)
    .then(response => handleApiResponse(response))
    .then(city => {
      dispatch(receiveCity({ city }));
      dispatch(stopLoading(false, CITY_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return city;
    })
    .catch(handleApiErrors(CITY_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateCity = (city: ICity): ThunkResult<Promise<ICity>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.put<ICity>(`/api/cities/city/${city.id}`, city)
    .then(response => handleApiResponse(response))
    .then(city => {
      batch(() => {
        dispatch(receiveCity({ city }));
        dispatch(hideLoader(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.success, CITY_UPDATE_SUCCESS));
      });
      return city;
    })
    .catch(handleApiErrors(CITY_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteCity = (cityId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(DIALOG_LOADER_ID));
  return http.delete(`/api/cities/city/${cityId}`)
    .then(response => handleApiResponse(response))
    .then(() => {
      batch(() => {
        dispatch(removeCity({ cityId }));
        dispatch(hideLoader(DIALOG_LOADER_ID));
        dispatch(showToast(Toast.success, CITY_DELETE_SUCCESS));
      });
    })
    .catch(handleApiErrors(CITY_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleCityEnabled = (params: ToggleEnabledParams): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/cities/city/toggle-enabled`, params)
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleCityEnabledField(params));
    })
    .catch(handleApiErrors(CITY_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};
