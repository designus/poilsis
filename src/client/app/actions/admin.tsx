import { ICity, IType } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils/constants';

import { ThunkResult } from 'types';
import { startLoading, endLoading } from 'actions/loader';
import { receiveCity } from './cities';
import { receiveType } from './types';
import { handleApiErrors, handleApiResponse, http } from './utils';

export const getAdminCity = (cityId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get<ICity>(`/api/cities/city/${cityId}`)
    .then(response => handleApiResponse(response))
    .then(city => {
      dispatch(receiveCity({ city }));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};

export const getAdminType = (typeId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get<IType>(`/api/types/type/${typeId}`)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveType(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load type', CONTENT_LOADER_ID, dispatch));
};
