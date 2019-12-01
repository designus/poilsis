import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { startLoading, endLoading } from 'actions/loader';
import { onUploadProgress, getFormDataFromFiles, getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
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
import { IImage, IItem, IItemDescFields, Omit, IsEnabled, Languages } from 'global-utils/typings';
import { getItemById } from 'selectors';
import {
  ItemsActionTypes,
  IReceiveItems,
  IReceiveItem,
  IReceiveImages,
  IReceiveItemDescription,
  IRemoveItem,
  IToggleItemRecommended,
  IUniqueItemProps,
  Toast,
  IAppState,
  ToggleEnabledParams,
  IToggleEnabled,
  IToggleItemApprovedByAdmin,
  ThunkDispatch,
  ThunkResult
} from 'types';

import { stopLoading, handleApiResponse, handleApiErrors, http } from './utils';

export const receiveItems = (props: Omit<IReceiveItems, 'type'>): IReceiveItems => ({
  type: ItemsActionTypes.RECEIVE_ITEMS,
  dataMap: props.dataMap,
  aliases: props.aliases,
  cityId: props.cityId,
  userId: props.userId,
  dataType: props.dataType
});

export const receiveItem = (item: IItem): IReceiveItem => ({
  type: ItemsActionTypes.RECEIVE_ITEM,
  item
});

export const receiveItemDescription = (itemId: string, descFields: IItemDescFields): IReceiveItemDescription => ({
  type: ItemsActionTypes.RECEIVE_ITEM_DESCRIPTION,
  itemId,
  descFields
});

export const removeItem = (itemId: string): IRemoveItem => ({
  type: ItemsActionTypes.REMOVE_ITEM,
  itemId
});

export const receiveImages = (itemId: string, images: IImage[], mainImage: string | null): IReceiveImages => ({
  type: ItemsActionTypes.RECEIVE_IMAGES,
  itemId,
  images,
  mainImage
});

export const toggleItemEnabledField = (params: ToggleEnabledParams): IToggleEnabled => ({
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED,
  ...params
});

export const toggleItemApprovedField = (itemId: string, isApproved: boolean): IToggleItemApprovedByAdmin => ({
  type: ItemsActionTypes.TOGGLE_ITEM_APPROVED_BY_ADMIN,
  itemId,
  isApproved
});

export const toggleItemRecommendedField = (itemId: string, isRecommended: boolean): IToggleItemRecommended => ({
  type: ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED,
  itemId,
  isRecommended
});

export const getNewItems = (items: IItem[], state: IAppState) => items.filter(item => !getItemById(state, item.id));

export const receiveNewItems = (items: IItem[], params: IUniqueItemProps = {}) => (dispatch, getState) => {
  const { userId, cityId, dataType } = params;
  const state: IAppState = getState();
  const newItems = getNewItems(items, state);
  const { dataMap, aliases } = getNormalizedData(newItems);
  dispatch(receiveItems({ dataMap, aliases, userId, cityId, dataType }));
};

export const loadItem = (locale: Languages, alias: string) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.get(`/api/items/view-item/${alias}`, setAcceptLanguageHeader(locale))
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(receiveItem(item));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const getItem = (itemId: string): ThunkResult<Promise<void>> => (dispatch: ThunkDispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get<IItem>(`/api/items/item/${itemId}`)
    .then(response => handleApiResponse(response))
    .then(response => {
      dispatch(receiveItem(response));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors('Unable to load Item', CONTENT_LOADER_ID, dispatch));
};

export const uploadPhotos = (itemId: string, files: File[]) => (dispatch) => {
  return http
    .put(`/api/items/item/upload-photos/${itemId}`, getFormDataFromFiles(files), {
      onUploadProgress: (e) => onUploadProgress(e, (loadedPercent) => dispatch(setUploadProgress(loadedPercent)))
    })
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(receiveImages(itemId, item.images, item.mainImage));
      dispatch(setUploadProgress(100));
      dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
      dispatch(uploadSuccess());
      return Promise.resolve(item.images);
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

export const updatePhotos = (itemId: string, images: IImage[]) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.put(`/api/items/item/update-photos/${itemId}`, {images})
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(receiveImages(itemId, item.images, item.mainImage));
      dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
      dispatch(endLoading(CONTENT_LOADER_ID));
      return Promise.resolve();
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

export const updateMainInfo = (item: IItem) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.put(`/api/items/item/main-info/${item.id}`, item)
    .then(handleApiResponse)
    .then((response: IItem) => {
      dispatch(receiveItem(response));
      dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateItemDescription = (itemId: string, itemDescFields: IItemDescFields) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.put(`/api/items/item/description/${itemId}`, itemDescFields)
    .then(handleApiResponse)
    .then((response: IItemDescFields) => {
      dispatch(receiveItemDescription(itemId, response));
      dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const createItem = (item: IItem) => (dispatch) => {

  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.post(`/api/items`, item)
    .then(handleApiResponse)
    .then((response: IItem) => {
      dispatch(receiveItem(response));
      dispatch(stopLoading(false, ITEM_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(ITEM_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const deleteItem = (itemId: string) => (dispatch) => {

  dispatch(startLoading(DIALOG_LOADER_ID));

  return http.delete(`/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(removeItem(item.id));
      dispatch(stopLoading(false, ITEM_DELETE_SUCCESS, CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors(ITEM_DELETE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemEnabled = (params: ToggleEnabledParams) => (dispatch) => {
  return http.patch(`/api/items/item/toggle-enabled`, params)
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleItemEnabledField(params));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.item.enable_error'));
    });
};

export const toggleItemApproved = (itemId: string, isApproved: boolean) => (dispatch) => {
  return http.patch(`/api/items/item/toggle-approved`, { itemId, isApproved })
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleItemApprovedField(itemId, isApproved));
    })
    .catch(err => {
      console.error('Err', err);
      dispatch(showToast(Toast.error, 'admin.item.approve_error'));
    });
};

export const toggleItemRecommended = (itemId: string, isRecommended: boolean) => (dispatch) => {
  return http.patch(`/api/items/item/toggle-recommended`, { itemId, isRecommended })
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleItemRecommendedField(itemId, isRecommended));
    })
    .catch(err => console.error('Err', err));
};
