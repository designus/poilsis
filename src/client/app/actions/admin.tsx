import { ICity, IType } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils/constants';

import { ThunkDispatch, ThunkResult } from 'types';
import { startLoading, endLoading } from 'actions/loader';
import { receiveCity } from './cities';
import { receiveType } from './types';
import { handleApiErrors, handleApiResponse, http } from './utils';

export const getAdminCity = (cityId: string): ThunkResult<Promise<void>> => (dispatch: ThunkDispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get<ICity>(`/api/cities/city/${cityId}`)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveCity(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load city', CONTENT_LOADER_ID, dispatch));
};

export const getAdminType = (typeId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get(`/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then((response: IType) => {
      dispatch(receiveType(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load type', CONTENT_LOADER_ID, dispatch));
};
