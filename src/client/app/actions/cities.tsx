import { batch } from 'react-redux';
import { mutation, query, types } from 'typed-graphqlify';
import { Locale } from 'global-utils';
import { Item, City } from 'global-utils/data-models';
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
import { EnableItemInput, CityInput } from 'global-utils/input-types';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { getNewItems, getNormalizedData, graphqlParams } from 'client-utils/methods';
import {
  CitiesActionTypes,
  Toast,
  ThunkDispatch,
  ThunkResult
} from 'types';

import {
  stopLoading,
  handleApiErrors,
  handleApiResponse,
  http,
  gqlRequest,
  handleGraphqlResponse,
  getTranslatableFieldFragment,
  getIsEnabledFragment,
  getNameFieldFragment,
  getPriceFragment,
  getCityFragment
} from './utils';

export const receiveCity = (city: City) => ({
  type: CitiesActionTypes.RECEIVE_CITY,
  city
}) as const;

export const removeCity = (cityId: string) => ({
  type: CitiesActionTypes.REMOVE_CITY,
  cityId
}) as const;

export const toggleCityEnabledField = (cityId: string, isEnabled: boolean, locale: Locale) => ({
  type: CitiesActionTypes.TOGGLE_CITY_ENABLED,
  cityId,
  isEnabled,
  locale
}) as const;

export const setCityItems = (cityId: string) => ({
  type: CitiesActionTypes.SET_CITY_ITEMS,
  cityId
}) as const;

export const getAdminCity = (cityId: string): ThunkResult<Promise<City>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const operation = {
    city: graphqlParams<City>({ id: '$cityId' }, getCityFragment())
  };

  return gqlRequest<typeof operation>({
    query: query(graphqlParams({ $cityId: 'String!' }, operation)),
    variables: { cityId }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    dispatch(receiveCity(response.city));
    dispatch(hideLoader(CONTENT_LOADER_ID));
    return response.city;
  })
  .catch(handleApiErrors(CITY_LOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const loadCityItems = (alias: string): ThunkResult<Promise<void> | null> => (dispatch, getState) => {
  const state = getState();
  const city = getCityByAlias(state, alias);
  const locale = state.locale.client;

  if (!city) {
    return null;
  }

  dispatch(showLoader(CONTENT_LOADER_ID));

  const operation = {
    cityItems: graphqlParams<Item[]>({ cityId: '$cityId' }, [{
      id: types.string,
      name: getNameFieldFragment(locale),
      alias: getTranslatableFieldFragment('cityAlias', locale),
      types: [types.string],
      address: types.string,
      userId: types.string,
      cityId: types.string,
      isEnabled: getIsEnabledFragment(locale),
      isRecommended: types.boolean,
      isApprovedByAdmin: types.boolean,
      mainImage: types.string,
      price: getPriceFragment(),
      currency: types.string
    }])
  };

  return gqlRequest<typeof operation>({
    query: query(graphqlParams({ $cityId: 'String!' }, operation)),
    variables: { cityId: city.id }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const newItems = getNewItems(response.cityItems, state);
    const data = getNormalizedData(newItems);
    batch(() => {
      dispatch(receiveItems(data.dataMap, data.aliases));
      dispatch(setCityItems(city.id));
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
  })
  .catch(err => {
    console.error(err);
    dispatch(hideLoader(CONTENT_LOADER_ID));
  });
};

export const createCity = (city: CityInput): ThunkResult<Promise<City>> => (dispatch: ThunkDispatch) => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const operation = {
    createCity: graphqlParams<City>({ city: '$city' }, getCityFragment())
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $city: 'CityInput!' }, operation)),
    variables: { city }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const newCity = response.createCity;
    dispatch(receiveCity(newCity));
    dispatch(stopLoading(false, CITY_CREATE_SUCCESS, CONTENT_LOADER_ID));
    return newCity;
  })
  .catch(handleApiErrors(CITY_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateCity = (city: CityInput, cityId: string): ThunkResult<Promise<City>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const operation = {
    updateCity: graphqlParams<City>({ city: '$city', id: '$cityId' }, getCityFragment())
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $city: 'CityInput!', $cityId: 'String!' }, operation)),
    variables: { city, cityId }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const updatedCity = response.updateCity;

    batch(() => {
      dispatch(receiveCity(updatedCity));
      dispatch(hideLoader(CONTENT_LOADER_ID));
      dispatch(showToast(Toast.success, CITY_UPDATE_SUCCESS));
    });

    return updatedCity;
  })
  .catch(handleApiErrors(CITY_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteCity = (cityId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(DIALOG_LOADER_ID));

  const operation = {
    deleteCity: graphqlParams<boolean>({ id: '$cityId' }, types.boolean)
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $cityId: 'String!' }, operation)),
    variables: { cityId }
  })
  .then(handleGraphqlResponse)
  .then(() => {
    batch(() => {
      dispatch(removeCity(cityId));
      dispatch(hideLoader(DIALOG_LOADER_ID));
      dispatch(showToast(Toast.success, CITY_DELETE_SUCCESS));
    });
  })
  .catch(handleApiErrors(CITY_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleCityEnabled = (params: EnableItemInput): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/cities/city/toggle-enabled`, params)
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleCityEnabledField(params.id, params.isEnabled, params.locale));
    })
    .catch(handleApiErrors(CITY_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};
