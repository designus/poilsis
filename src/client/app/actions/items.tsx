import { batch } from 'react-redux';
import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { showLoader, hideLoader } from 'actions/loader';
import { onUploadProgress, getFormDataFromFiles, getNormalizedData, setAcceptLanguageHeader, getNewItems } from 'client-utils/methods';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import {
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_ERROR,
  ITEM_CREATE_SUCCESS,
  ITEM_CREATE_ERROR,
  ITEM_DELETE_SUCCESS,
  ITEM_DELETE_ERROR,
  ITEM_LOAD_ERROR,
  ITEM_APPROVE_ERROR,
  ITEM_ENABLE_ERROR,
  ITEM_RECOMMEND_ERROR,
  ITEMS_UPLOAD_SUCCESS,
  ITEMS_UPLOAD_ERROR,
  ITEMS_REMOVE_SUCCESS,
  ITEMS_REMOVE_ERROR,
  IMAGES_UPLOAD_ERROR,
  IMAGES_UPLOAD_SUCCESS,
  IMAGES_UPDATE_SUCCESS,
  IMAGES_UPDATE_ERROR
} from 'data-strings';
import { IImage, IItem, IItemDescFields, Locale } from 'global-utils/typings';
import { generateMockedData } from 'global-utils/mockedData';
import {
  ItemsActionTypes,
  IReceiveItems,
  IReceiveItem,
  IReceiveImages,
  IReceiveItemDescription,
  IRemoveItem,
  IRemoveMockedData,
  IReceiveMockedData,
  IToggleItemRecommended,
  Toast,
  ToggleEnabledParams,
  IToggleEnabled,
  IToggleItemApprovedByAdmin,
  ThunkResult,
  ActionCreator
} from 'types';

import { handleApiResponse, http, handleApiErrors } from './utils';

export const receiveItems: ActionCreator<IReceiveItems> = props => ({
  type: ItemsActionTypes.RECEIVE_ITEMS,
  ...props
});

export const receiveItem: ActionCreator<IReceiveItem> = props => ({
  type: ItemsActionTypes.RECEIVE_ITEM,
  ...props
});

export const receiveItemDescription: ActionCreator<IReceiveItemDescription> = props => ({
  type: ItemsActionTypes.RECEIVE_ITEM_DESCRIPTION,
  ...props
});

export const removeItem: ActionCreator<IRemoveItem> = props => ({
  type: ItemsActionTypes.REMOVE_ITEM,
  ...props
});

export const removeMockedData = (): IRemoveMockedData => ({
  type: ItemsActionTypes.REMOVE_MOCKED_DATA
});

export const receiveMockedData: ActionCreator<IReceiveMockedData> = props => ({
  type: ItemsActionTypes.RECEIVE_MOCKED_DATA,
  ...props
});

export const receiveImages: ActionCreator<IReceiveImages> = props => ({
  type: ItemsActionTypes.RECEIVE_IMAGES,
  ...props
});

export const toggleItemEnabledField: ActionCreator<IToggleEnabled> = params => ({
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED,
  ...params
});

export const toggleItemApprovedField: ActionCreator<IToggleItemApprovedByAdmin> = params => ({
  type: ItemsActionTypes.TOGGLE_ITEM_APPROVED_BY_ADMIN,
  ...params
});

export const toggleItemRecommendedField: ActionCreator<IToggleItemRecommended> = params => ({
  type: ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED,
  ...params
});

export const getClientItem = (locale: Locale, alias: string): ThunkResult<Promise<void>> => (dispatch) => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.get(`/api/items/client-item/${alias}`, setAcceptLanguageHeader(locale))
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(receiveItem({ item }));
      dispatch(hideLoader(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
};

export const getAdminItem = (itemId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.get<IItem>(`/api/items/admin-item/${itemId}`)
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveItem({ item }));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(handleApiErrors(ITEM_LOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const uploadPhotos = (itemId: string, files: File[]): ThunkResult<Promise<IImage[]>> => dispatch => {
  return http
    .put<IItem>(`/api/items/item/upload-photos/${itemId}`, getFormDataFromFiles(files), {
      onUploadProgress: (e) => onUploadProgress(e, (loadedPercent: number) => dispatch(setUploadProgress(loadedPercent)))
    })
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveImages({ itemId, images: item.images, mainImage: item.mainImage }));
        dispatch(setUploadProgress(100));
        dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
        dispatch(uploadSuccess());
      });

      return item.images;
    })
    .catch(err => {
      console.error(err);
      const errors = err.images;
      const message = errors && errors.message || IMAGES_UPLOAD_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(uploadError());
      return errors;
    });
};

export const updatePhotos = (itemId: string, images: IImage[]): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.put<IItem>(`/api/items/item/update-photos/${itemId}`, {images})
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveImages({ itemId, images: item.images, mainImage: item.mainImage }));
        dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      const errors = err.images;
      const message = errors && errors.message || IMAGES_UPDATE_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(hideLoader(CONTENT_LOADER_ID));
      return errors;
    });
};

export const updateMainInfo = (item: IItem): ThunkResult<Promise<IItem>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.put<IItem>(`/api/items/item/main-info/${item.id}`, item)
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveItem({ item }));
        dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
      return item;
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateItemDescription = (itemId: string, itemDescFields: IItemDescFields): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.put<IItemDescFields>(`/api/items/item/description/${itemId}`, itemDescFields)
    .then(response => handleApiResponse(response))
    .then(response => {
      batch(() => {
        dispatch(receiveItemDescription({ itemId, descFields: response }));
        dispatch(hideLoader(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
      });
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const createItem = (item: IItem): ThunkResult<Promise<IItem>> => dispatch => {

  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.post<IItem>(`/api/items`, item)
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveItem({ item }));
        dispatch(hideLoader(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.success, ITEM_CREATE_SUCCESS));
      });
      return item;
    })
    .catch(handleApiErrors(ITEM_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const deleteItem = (itemId: string): ThunkResult<Promise<void>> => (dispatch) => {

  dispatch(showLoader(DIALOG_LOADER_ID));

  return http.delete(`/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then((item: IItem) => {
      batch(() => {
        dispatch(removeItem({ itemId: item.id }));
        dispatch(hideLoader(DIALOG_LOADER_ID));
        dispatch(showToast(Toast.success, ITEM_DELETE_SUCCESS));
      });
    })
    .catch(handleApiErrors(ITEM_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleItemEnabled = (params: ToggleEnabledParams): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-enabled`, params)
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemEnabledField(params));
    })
    .catch(handleApiErrors(ITEM_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemApproved = (itemId: string, isApproved: boolean): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-approved`, { itemId, isApproved })
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemApprovedField({ itemId, isApproved }));
    })
    .catch(handleApiErrors(ITEM_APPROVE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemRecommended = (itemId: string, isRecommended: boolean): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-recommended`, { itemId, isRecommended })
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemRecommendedField({ itemId, isRecommended }));
    })
    .catch(handleApiErrors(ITEM_RECOMMEND_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const addMockedDataAsync = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  const state = getState();
  const cityIds = Object.keys(state.cities.dataMap);
  const typeIds = Object.keys(state.types.dataMap);
  const data = generateMockedData(1000, cityIds, typeIds);

  return http.post<IItem[]>('/api/items/mocked-data', { data })
    .then(response => handleApiResponse(response))
    .then(items => {
      const newItems = getNewItems(items, state);
      const { dataMap, aliases } = getNormalizedData(newItems);
      batch(() => {
        dispatch(receiveMockedData({ dataMap, aliases }));
        dispatch(showToast(Toast.success, ITEMS_UPLOAD_SUCCESS));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(handleApiErrors(ITEMS_UPLOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const removeMockedDataAsync = (): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.delete('/api/items/mocked-data')
    .then(response => handleApiResponse(response))
    .then(() => {
      batch(() => {
        dispatch(showToast(Toast.success, ITEMS_REMOVE_SUCCESS));
        dispatch(removeMockedData());
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(handleApiErrors(ITEMS_REMOVE_ERROR, CONTENT_LOADER_ID, dispatch));
};
