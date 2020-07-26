import { batch } from 'react-redux';
import { mutation, query, types } from 'typed-graphqlify';
import { Locale } from 'global-utils';
import { Type } from 'global-utils/data-models';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { showToast } from 'actions/toast';
import { EnableInput, TypeInput } from 'global-utils/input-types';
import { graphqlParams } from 'client-utils/methods';
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
  Toast,
  ThunkResult
} from 'types';

import {
  handleApiErrors,
  handleApiResponse,
  http,
  gqlRequest,
  handleGraphqlResponse,
  getTypeFragment,
  getTranslatableFieldFragment,
  getIsEnabledFragment,
  getNameFieldFragment,
  getPriceFragment,
  getCityFragment
} from './utils';
import { showLoader, hideLoader } from './loader';

export const selectType = (typeId: string) => ({
  type: TypesActionTypes.SELECT_TYPE,
  typeId
}) as const;

export const receiveType = (newType: Type) => ({
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

  const operation = {
    type: graphqlParams<Type>({ id: '$typeId' }, getTypeFragment())
  };

  return gqlRequest<typeof operation>({
    query: query(graphqlParams({ $typeId: 'String!' }, operation)),
    variables: { typeId }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    batch(() => {
      dispatch(receiveType(response.type));
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
  })
  .catch(handleApiErrors(TYPE_LOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const createType = (type: TypeInput): ThunkResult<Promise<Type>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const operation = {
    createType: graphqlParams<Type>({ type: '$type' }, getTypeFragment())
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $type: 'TypeInput!' }, operation)),
    variables: { type }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const newType = response.createType;

    batch(() => {
      dispatch(receiveType(newType));
      dispatch(hideLoader(CONTENT_LOADER_ID));
      dispatch(showToast(Toast.success, TYPE_CREATE_SUCCESS));
    });

    return newType;
  })
  .catch(handleApiErrors(TYPE_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateType = (type: TypeInput, typeId: string): ThunkResult<Promise<Type>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const operation = {
    updateType: graphqlParams<Type>({ type: '$type', id: '$typeId' }, getTypeFragment())
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $type: 'TypeInput!', $typeId: 'String!' }, operation)),
    variables: { type, typeId }
  })
  .then(handleGraphqlResponse)
    .then(response => {
      const updatedType = response.updateType;

      batch(() => {
        dispatch(receiveType(updatedType));
        dispatch(hideLoader(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.success, TYPE_UPDATE_SUCCESS));
      });

      return updatedType;
    })
    .catch(handleApiErrors(TYPE_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const deleteType = (typeId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(DIALOG_LOADER_ID));

  const operation = {
    deleteType: graphqlParams<boolean>({ id: '$typeId' }, types.boolean)
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $typeId: 'String!' }, operation)),
    variables: { typeId }
  })
  .then(handleGraphqlResponse)
  .then(() => {
    batch(() => {
      dispatch(removeType(typeId));
      dispatch(hideLoader(DIALOG_LOADER_ID));
      dispatch(showToast(Toast.success, TYPE_DELETE_SUCCESS));
    });
  })
  .catch(handleApiErrors(TYPE_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleTypeEnabled = (params: EnableInput): ThunkResult<Promise<void>> => dispatch => {
  const operation = {
    enableType: graphqlParams<boolean>({ params: '$params' }, types.boolean)
  };

  return gqlRequest<typeof operation>({
    query: mutation(graphqlParams({ $params: 'EnableInput!' }, operation)),
    variables: { params }
  })
  .then(handleGraphqlResponse)
  .then(() => {
    dispatch(toggleTypeEnabledField(params.id, params.isEnabled, params.locale));
  })
  .catch(handleApiErrors(TYPE_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};
