import { batch } from 'react-redux';
import { IType, Locale } from 'global-utils';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { showToast } from 'actions/toast';
import {
  TYPE_CREATE_SUCCESS,
  TYPE_UPDATE_SUCCESS,
  TYPE_DELETE_SUCCESS,
  TYPE_CREATE_ERROR,
  TYPE_UPDATE_ERROR,
  TYPE_ENABLE_ERROR,
  TYPE_DELETE_ERROR,
  TYPE_LOAD_ERROR
} from 'data-strings';
import {
  TypesActionTypes,
  ToggleEnabledParams,
  Toast,
  ThunkResult
} from 'types';

import { handleApiErrors, handleApiResponse, http } from './utils';
import { showLoader, hideLoader } from './loader';

export const selectType = (typeId: string) => ({
  type: TypesActionTypes.SELECT_TYPE,
  typeId
}) as const;

export const receiveType = (newType: IType) => ({
  type: TypesActionTypes.RECEIVE_TYPE,
  newType
}) as const;

export const removeType = (typeId: string) => ({
  type: TypesActionTypes.REMOVE_TYPE,
  typeId
}) as const;

export const toggleTypeEnabledField = (typeId: string, isEnabled: boolean, locale: Locale) => ({
  type: TypesActionTypes.TOGGLE_TYPE_ENABLED,
  typeId,
  isEnabled,
  locale
}) as const;

export const getAdminType = (typeId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.get<IType>(`/api/types/type/${typeId}`)
    .then(response => handleApiResponse(response))
    .then(response => {
      batch(() => {
        dispatch(receiveType(response));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(handleApiErrors(TYPE_LOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const createType = (type: IType): ThunkResult<Promise<IType>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.post<IType>('/api/types', type)
    .then(response => handleApiResponse(response))
    .then(newType => {
      batch(() => {
        dispatch(receiveType(newType));
        dispatch(hideLoader(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.success, TYPE_CREATE_SUCCESS));
      });
      return newType;
    })
    .catch(handleApiErrors(TYPE_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateType = (adminType: IType): ThunkResult<Promise<IType>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.put<IType>(`/api/types/type/${adminType.id}`, adminType)
    .then(response => handleApiResponse(response))
    .then(newType => {
      batch(() => {
        dispatch(receiveType(newType));
        dispatch(hideLoader(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.success, TYPE_UPDATE_SUCCESS));
      });
      return newType;
    })
    .catch(handleApiErrors(TYPE_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteType = (typeId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(DIALOG_LOADER_ID));
  return http.delete(`/api/types/type/${typeId}`)
    .then(handleApiResponse)
    .then(() => {
      batch(() => {
        dispatch(removeType(typeId));
        dispatch(hideLoader(DIALOG_LOADER_ID));
        dispatch(showToast(Toast.success, TYPE_DELETE_SUCCESS));
      });
    })
    .catch(handleApiErrors(TYPE_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleTypeEnabled = (params: ToggleEnabledParams): ThunkResult<Promise<void>> => dispatch => {
  return http.patch(`/api/types/type/toggle-enabled`, params)
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleTypeEnabledField(params.id, params.isEnabled, params.locale));
    })
    .catch(handleApiErrors(TYPE_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};
