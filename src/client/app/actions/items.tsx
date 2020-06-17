import { batch } from 'react-redux';
import { mutation, query, params, types } from 'typed-graphqlify';
import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { showLoader, hideLoader } from 'actions/loader';
import { onUploadProgress, getNormalizedData, setAcceptLanguageHeader, getNewItems, graphqlParams } from 'client-utils/methods';
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
import { IItemDescFields, Locale } from 'global-utils/typings';
import { generateMockedData } from 'global-utils/mockedData';
import { DescriptionInput } from 'global-utils/input-types';
import {
  ItemsActionTypes,
  Toast,
  ToggleEnabledParams,
  ThunkResult,
  IItemsMap,
  IAliasMap
} from 'types';
import { Image, Item } from 'global-utils/data-models';

import { handleApiResponse, http, handleApiErrors, gqlRequest, handleGraphqlResponse } from './utils';

export const receiveItems = (dataMap: IItemsMap, aliases: IAliasMap) => ({
  type: ItemsActionTypes.RECEIVE_ITEMS,
  dataMap,
  aliases
}) as const;

export const receiveItem = (item: Item) => ({
  type: ItemsActionTypes.RECEIVE_ITEM,
  item
}) as const;

export const receiveItemDescription = (itemId: string, descFields: IItemDescFields) => ({
  type: ItemsActionTypes.RECEIVE_ITEM_DESCRIPTION,
  itemId,
  descFields
}) as const;

export const removeItem = (itemId: string) => ({
  type: ItemsActionTypes.REMOVE_ITEM,
  itemId
}) as const;

export const removeMockedData = () => ({
  type: ItemsActionTypes.REMOVE_MOCKED_DATA
}) as const;

export const receiveMockedData = (dataMap: IItemsMap, aliases: IAliasMap) => ({
  type: ItemsActionTypes.RECEIVE_MOCKED_DATA,
  dataMap,
  aliases
}) as const;

export const receiveImages = (itemId: string, images: Image[], mainImage: string | null) => ({
  type: ItemsActionTypes.RECEIVE_IMAGES,
  itemId,
  images,
  mainImage
}) as const;

export const toggleItemEnabledField = (itemId: string, isEnabled: boolean, locale: Locale) => ({
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED,
  itemId,
  isEnabled,
  locale
}) as const;

export const toggleItemApprovedField = (itemId: string, isApproved: boolean) => ({
  type: ItemsActionTypes.TOGGLE_ITEM_APPROVED_BY_ADMIN,
  itemId,
  isApproved
}) as const;

export const toggleItemRecommendedField = (itemId: string, isRecommended: boolean) => ({
  type: ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED,
  itemId,
  isRecommended
}) as const;

export const getClientItem = (locale: Locale, alias: string): ThunkResult<Promise<void>> => (dispatch) => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.get(`/api/items/client-item/${alias}`, setAcceptLanguageHeader(locale))
    .then(handleApiResponse)
    .then((item: Item) => {
      dispatch(receiveItem(item));
      dispatch(hideLoader(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
};

export const getAdminItem = (itemId: string): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  return http.get<Item>(`/api/items/admin-item/${itemId}`)
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveItem(item));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(handleApiErrors(ITEM_LOAD_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const uploadPhotos = (itemId: string, files: File[]): ThunkResult<Promise<Image[]>> => dispatch => {

  const query = {
    uploadImages: params({ files: '$files', id: '$itemId' }, {
      mainImage: types.string,
      images: [{
        id: types.string,
        fileName: types.string,
        path: types.string,
        thumbName: types.string
      }]
    })
  };

  return gqlRequest<typeof query>({
    query: mutation(params({ $files: '[Upload!]!', $itemId: 'String!' }, query)),
    variables: { files, itemId }
  }, {
    onUploadProgress: (e: any) => onUploadProgress(e, (loadedPercent: number) => dispatch(setUploadProgress(loadedPercent)))
  })
  .then(handleGraphqlResponse)
  .then(({ uploadImages: item }) => {
    batch(() => {
      dispatch(setUploadProgress(100));
      dispatch(receiveImages(itemId, item.images, item.mainImage));
      dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
      dispatch(uploadSuccess());
    });

    return item.images;
  })
  .catch(err => {
    console.error(err);
    dispatch(showToast(Toast.error, IMAGES_UPLOAD_ERROR));
    dispatch(uploadError());
    return [];
  });
};

export const updatePhotos = (itemId: string, images: Image[]): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const query = {
    updateImages: params({ id: '$itemId', images: '$images' }, {
      mainImage: types.string,
      images: [{
        id: types.string,
        fileName: types.string,
        path: types.string,
        thumbName: types.string
      }]
    })
  };

  return gqlRequest<typeof query>({
    query: mutation(params({ $itemId: 'String!', $images: '[ImageInput!]!' }, query)),
    variables: { itemId, images }
  })
  .then(handleGraphqlResponse)
  .then(({ updateImages: item }) => {
    batch(() => {
      dispatch(receiveImages(itemId, item.images, item.mainImage));
      dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
  })
  .catch(err => {
    console.error(err);
    dispatch(showToast(Toast.error, IMAGES_UPDATE_ERROR));
    dispatch(hideLoader(CONTENT_LOADER_ID));
  });
};

export const updateMainInfo = (item: Item): ThunkResult<Promise<Item>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.put<Item>(`/api/items/item/main-info/${item.id}`, item)
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveItem(item));
        dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
      return item;
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateItemDescription = (itemId: string, description: DescriptionInput): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const query = {
    updateDescription: params({ id: '$itemId', description: '$description' }, {
      description: {
        lt: types.string,
        en: types.string,
        ru: types.string
      },
      metaTitle: {
        lt: types.string,
        en: types.string,
        ru: types.string
      },
      metaDescription: {
        lt: types.string,
        en: types.string,
        ru: types.string
      }
    })
  };

  return gqlRequest<typeof query>({
    query: mutation(params({ $itemId: 'String!', $description: 'DescriptionInput!' }, query)),
    variables: { itemId, description }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    batch(() => {
      dispatch(receiveItemDescription(itemId, response.updateDescription));
      dispatch(hideLoader(CONTENT_LOADER_ID));
      dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
    });
  })
  .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const createItem = (item: Item): ThunkResult<Promise<Item>> => dispatch => {

  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.post<Item>(`/api/items`, item)
    .then(response => handleApiResponse(response))
    .then(item => {
      batch(() => {
        dispatch(receiveItem(item));
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
    .then((item: Item) => {
      batch(() => {
        dispatch(removeItem(item.id));
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
      dispatch(toggleItemEnabledField(params.id, params.isEnabled, params.locale));
    })
    .catch(handleApiErrors(ITEM_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemApproved = (itemId: string, isApproved: boolean): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-approved`, { itemId, isApproved })
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemApprovedField(itemId, isApproved));
    })
    .catch(handleApiErrors(ITEM_APPROVE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemRecommended = (itemId: string, isRecommended: boolean): ThunkResult<Promise<void>> => dispatch => {
  return http.patch<boolean>(`/api/items/item/toggle-recommended`, { itemId, isRecommended })
    .then(response => handleApiResponse(response))
    .then(() => {
      dispatch(toggleItemRecommendedField(itemId, isRecommended));
    })
    .catch(handleApiErrors(ITEM_RECOMMEND_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const addMockedDataAsync = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  const state = getState();
  const cityIds = Object.keys(state.cities.dataMap);
  const typeIds = Object.keys(state.types.dataMap);
  const data = generateMockedData(1000, cityIds, typeIds);

  const query = {
    addMockedData: graphqlParams<Item[]>({ data: '$data' }, [{
      id: types.string,
      name: {
        lt: types.string,
        en: types.string,
        ru: types.string
      },
      alias: {
        lt: types.string,
        en: types.string,
        ru: types.string
      },
      isEnabled: {
        lt: types.boolean,
        en: types.boolean,
        ru: types.boolean
      },
      price: {
        from: types.number,
        to: types.number
      },
      cityId: types.string,
      currency: types.string,
      address: types.string,
      mainImage: types.string,
      isApprovedByAdmin: types.boolean,
      isRecommended: types.boolean,
      images: [{
        id: types.string,
        fileName: types.string,
        path: types.string,
        thumbName: types.string
      }]
    }]
  )};

  return gqlRequest<typeof query>({
    query: mutation(params({ $data: '[ItemInput!]!' }, query)),
    variables: { data }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const items = response.addMockedData;
    const newItems = getNewItems(items, state);
    const { dataMap, aliases } = getNormalizedData(newItems);
    batch(() => {
      dispatch(receiveMockedData(dataMap, aliases));
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
