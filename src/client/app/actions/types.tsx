import { IType } from 'global-utils';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { showToast } from 'actions/toast';
import {
  TYPE_CREATE_SUCCESS,
  TYPE_UPDATE_SUCCESS,
  TYPE_DELETE_SUCCESS,
  TYPE_CREATE_ERROR,
  TYPE_UPDATE_ERROR,
  TYPE_DELETE_ERROR
} from 'data-strings';
import { TypesActionTypes, ISelectType, IReceiveType, IRemoveType, ToggleEnabledParams, Toast, IToggleEnabled, ThunkResult } from 'types';

import { stopLoading, handleApiErrors, handleApiResponse, http } from './utils';
import { startLoading } from './loader';

export const selectType = (typeId: string): ISelectType => ({
  type: TypesActionTypes.SELECT_TYPE,
  typeId
});

export const receiveType = (newType: IType): IReceiveType => ({
  type: TypesActionTypes.RECEIVE_TYPE,
  newType
});

export const removeType = (typeId: string): IRemoveType => ({
  type: TypesActionTypes.REMOVE_TYPE,
  typeId
});

export const toggleTypeEnabledField = (params: ToggleEnabledParams): IToggleEnabled => ({
  type: TypesActionTypes.TOGGLE_TYPE_ENABLED,
  ...params
});

export const createType = (type: IType): ThunkResult<Promise<IType>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.post<IType>('/api/types', type)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveType(response));
      dispatch(stopLoading(false, TYPE_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return response;
    })
    .catch(handleApiErrors(TYPE_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateType = (adminType: IType): ThunkResult<Promise<IType>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.put<IType>(`/api/types/type/${adminType.id}`, adminType)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveType(response));
      dispatch(stopLoading(false, TYPE_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return response;
    })
    .catch(handleApiErrors(TYPE_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteType = (typeId: string) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return http.delete(`/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then(() => {
      dispatch(removeType(typeId));
      dispatch(stopLoading(false, TYPE_DELETE_SUCCESS, DIALOG_LOADER_ID));
      return Promise.resolve();
    })
    .catch(handleApiErrors(TYPE_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleTypeEnabled = (params: ToggleEnabledParams) => (dispatch) => {
  return http.patch(`/api/types/type/toggle-enabled`, params)
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleTypeEnabledField(params));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.type.enable_error'));
    });
};
