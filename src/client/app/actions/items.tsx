import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { batch } from 'react-redux';
import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { startLoading, endLoading } from 'actions/loader';
import { onUploadProgress, getFormDataFromFiles, getNormalizedData, setAcceptLanguageHeader, getNewItems } from 'client-utils/methods';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import {
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_ERROR,
  ITEM_CREATE_SUCCESS,
  ITEM_CREATE_ERROR,
  ITEM_DELETE_SUCCESS,
  ITEM_DELETE_ERROR,
  IMAGES_UPLOAD_ERROR,
  IMAGES_UPLOAD_SUCCESS,
  IMAGES_UPDATE_SUCCESS,
  IMAGES_UPDATE_ERROR
} from 'data-strings';
import { IImage, IItem, IItemDescFields, Languages } from 'global-utils/typings';
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

import { stopLoading, handleApiResponse, handleApiErrors, http } from './utils';

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

export const removeMockedData: ActionCreator<IRemoveMockedData> = () => ({
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

export const getClientItem = (locale: Languages, alias: string): ThunkResult<Promise<void>> => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.get(`/api/items/client-item/${alias}`, setAcceptLanguageHeader(locale))
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(receiveItem({ item }));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const getAdminItem = (itemId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get<IItem>(`/api/items/admin-item/${itemId}`)
    .then(response => handleApiResponse(response))
    .then(item => {
      dispatch(receiveItem({ item }));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load Item', CONTENT_LOADER_ID, dispatch));
};

export const uploadPhotos = (itemId: string, files: File[]): ThunkResult<Promise<IImage[]>> => dispatch => {
  return http
    .put<IItem>(`/api/items/item/upload-photos/${itemId}`, getFormDataFromFiles(files), {
      onUploadProgress: (e) => onUploadProgress(e, (loadedPercent) => dispatch(setUploadProgress(loadedPercent)))
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
      return Promise.reject(errors);
    });
};

export const updatePhotos = (itemId: string, images: IImage[]): ThunkResult<Promise<void>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.put<IItem>(`/api/items/item/update-photos/${itemId}`, {images})
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveImages({ itemId, images: item.images, mainImage: item.mainImage }));
        dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      const errors = err.images;
      const message = errors && errors.message || IMAGES_UPDATE_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(endLoading(CONTENT_LOADER_ID));
      return Promise.reject(errors);
    });
};

export const updateMainInfo = (item: IItem): ThunkResult<Promise<IItem>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.put<IItem>(`/api/items/item/main-info/${item.id}`, item)
    .then(response => handleApiResponse(response))
    .then(item => {
      dispatch(receiveItem({ item }));
      dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return item;
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateItemDescription = (itemId: string, itemDescFields: IItemDescFields): ThunkResult<Promise<void>> => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.put<IItemDescFields>(`/api/items/item/description/${itemId}`, itemDescFields)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveItemDescription({ itemId, descFields: response }));
      dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const createItem = (item: IItem): ThunkResult<Promise<IItem>> => dispatch => {

  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.post<IItem>(`/api/items`, item)
    .then(response => handleApiResponse(response))
    .then(item => {
      dispatch(receiveItem({ item }));
      dispatch(stopLoading(false, ITEM_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return item;
    })
    .catch(handleApiErrors(ITEM_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const deleteItem = (itemId: string): ThunkResult<Promise<void>> => (dispatch) => {

  dispatch(startLoading(DIALOG_LOADER_ID));

  return http.delete(`/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(removeItem({ itemId: item.id }));
      dispatch(stopLoading(false, ITEM_DELETE_SUCCESS, CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors(ITEM_DELETE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemEnabled = (params: ToggleEnabledParams): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-enabled`, params)
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemEnabledField(params));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.item.enable_error'));
    });
};

export const toggleItemApproved = (itemId: string, isApproved: boolean): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-approved`, { itemId, isApproved })
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemApprovedField({ itemId, isApproved }));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.item.approve_error'));
    });
};

export const toggleItemRecommended = (itemId: string, isRecommended: boolean): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-recommended`, { itemId, isRecommended })
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemRecommendedField({ itemId, isRecommended }));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.item.recommend_error'));
    });
};

export const addMockedDataAsync = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  dispatch(showLoading());
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
        dispatch(showToast(Toast.success, ITEM_CREATE_SUCCESS));
        dispatch(hideLoading());
      });
    })
    .catch(err => {
      console.error('Unable to add mocked data', err);
      batch(() => {
        dispatch(showToast(Toast.error, ITEM_CREATE_ERROR));
        dispatch(hideLoading());
      });
    });
};

export const removeMockedDataAsync = (): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoading());
  return http.delete('/api/items/mocked-data')
    .then(response => handleApiResponse(response))
    .then(() => {
      batch(() => {
        dispatch(showToast(Toast.success, ITEM_DELETE_SUCCESS));
        dispatch(removeMockedData());
        dispatch(hideLoading());
      });
    })
    .catch(err => {
      console.error('Unable to remove mocked data', err);
      batch(() => {
        dispatch(showToast(Toast.error, ITEM_DELETE_ERROR));
        dispatch(hideLoading());
      });
    });
};
