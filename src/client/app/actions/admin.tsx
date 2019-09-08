import axios from 'axios';

import { ICity, IType, IItem } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { startLoading, endLoading } from 'actions/loader';
import { receiveItem } from './items';
import { receiveCity } from './cities';
import { receiveType } from './types';
import { handleApiErrors, handleApiResponse } from './utils';
import { config } from '../../../../config';

export const getAdminCity = (cityId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/cities/city/${cityId}`)
    .then(handleApiResponse)
    .then((response: ICity) => {
      dispatch(receiveCity(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};

export const getAdminType = (typeId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then((response: IType) => {
      dispatch(receiveType(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load type', CONTENT_LOADER_ID, dispatch));
};

export const getAdminItem = (itemId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then((response: IItem) => {
      dispatch(receiveItem(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load Item', CONTENT_LOADER_ID, dispatch));
};
