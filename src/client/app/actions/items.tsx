import { batch } from 'react-redux';
import { mutation, types } from 'typed-graphqlify';

import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { showLoader, hideLoader } from 'actions/loader';
import {
  onUploadProgress,
  getNormalizedData,
  setAcceptLanguageHeader,
  getNewItems,
  graphqlParams
} from 'client-utils/methods';
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
import { Image, Item } from 'global-utils/data-models';
import { DescriptionInput, EnableItemInput, MainInfoInput } from 'global-utils/input-types';
import {
  ItemsActionTypes,
  Toast,
  ThunkResult,
  IItemsMap,
  IAliasMap
} from 'types';

import {
  handleApiResponse,
  http,
  handleApiErrors,
  gqlRequest,
  handleGraphqlResponse,
  mainInfoFragment,
  imagesFragment,
  translatableFieldFragment
} from './utils';

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
    uploadImages: graphqlParams<Item>({ files: '$files', id: '$itemId' }, imagesFragment)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $files: '[Upload!]!', $itemId: 'String!' }, query)),
    variables: { files, itemId }
  }, {
    onUploadProgress: (e: any) => onUploadProgress(e, (loadedPercent: number) => dispatch(setUploadProgress(loadedPercent)))
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const item = response.uploadImages;

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
    updateImages: graphqlParams<Item>({ id: '$itemId', images: '$images' }, imagesFragment)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $itemId: 'String!', $images: '[ImageInput!]!' }, query)),
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

export const updateMainInfo = (item: MainInfoInput, itemId: string): ThunkResult<Promise<Item>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const query = {
    updateItem: graphqlParams<Item>({ item: '$item', id: '$itemId' }, mainInfoFragment)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $item: 'MainInfoInput!', $itemId: 'String!' }, query)),
    variables: { item, itemId }
  })
  .then(handleGraphqlResponse)
  .then(item => {
    const updatedItem = item.updateItem;

    batch(() => {
      dispatch(receiveItem(updatedItem));
      dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });

    return updatedItem;
  })
  .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateItemDescription = (itemId: string, description: DescriptionInput): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(CONTENT_LOADER_ID));

  const query = {
    updateDescription: graphqlParams<DescriptionInput>({ id: '$itemId', description: '$description' }, {
      description: translatableFieldFragment,
      metaTitle: translatableFieldFragment,
      metaDescription: translatableFieldFragment
    })
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $itemId: 'String!', $description: 'DescriptionInput!' }, query)),
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

export const createItem = (item: MainInfoInput): ThunkResult<Promise<Item>> => dispatch => {

  dispatch(showLoader(CONTENT_LOADER_ID));

  const query = {
    createItem: graphqlParams<Item>({ item: '$item' }, mainInfoFragment)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $item: 'MainInfoInput!' }, query)),
    variables: { item }
  })
  .then(handleGraphqlResponse)
  .then(response => {
    const createdItem = response.createItem;

    batch(() => {
      dispatch(receiveItem(createdItem));
      dispatch(hideLoader(CONTENT_LOADER_ID));
      dispatch(showToast(Toast.success, ITEM_CREATE_SUCCESS));
    });

    return createdItem;
  })
  .catch(handleApiErrors(ITEM_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const deleteItem = (itemId: string): ThunkResult<Promise<void>> => (dispatch) => {

  dispatch(showLoader(DIALOG_LOADER_ID));

  const query = {
    removeItem: graphqlParams<boolean>({ id: '$itemId' }, types.boolean)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $itemId: 'String!' }, query)),
    variables: { itemId }
  })
  .then(handleGraphqlResponse)
  .then(() => {
    batch(() => {
      dispatch(removeItem(itemId));
      dispatch(hideLoader(DIALOG_LOADER_ID));
      dispatch(showToast(Toast.success, ITEM_DELETE_SUCCESS));
    });
  })
  .catch(handleApiErrors(ITEM_DELETE_ERROR, DIALOG_LOADER_ID, dispatch));
};

export const toggleItemEnabled = (params: EnableItemInput): ThunkResult<Promise<void>> => dispatch => {

  const query = {
    enableItem: graphqlParams<boolean>({ params: '$params' }, types.boolean)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $params: 'EnableItemInput!' }, query)),
    variables: { params }
  })
  .then(handleGraphqlResponse)
  .then(() => {
    dispatch(toggleItemEnabledField(params.id, params.isEnabled, params.locale));
  })
  .catch(handleApiErrors(ITEM_ENABLE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemApproved = (itemId: string, isApproved: boolean): ThunkResult<Promise<void>> => dispatch => {

  const query = {
    approveItem: graphqlParams<boolean>({ id: '$itemId', isApprovedByAdmin: '$isApproved' }, types.boolean)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $itemId: 'String!', $isApproved: 'Boolean!' }, query)),
    variables: { itemId, isApproved }
  })
  .then(handleGraphqlResponse)
  .then(() => {
    dispatch(toggleItemApprovedField(itemId, isApproved));
  })
  .catch(handleApiErrors(ITEM_APPROVE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemRecommended = (itemId: string, isRecommended: boolean): ThunkResult<Promise<void>> => dispatch => {

  const query = {
    recommendItem: graphqlParams<boolean>({ id: '$itemId', isRecommended: '$isRecommended' }, types.boolean)
  };

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $itemId: 'String!', $isRecommended: 'Boolean!' }, query)),
    variables: { itemId, isRecommended }
  })
  .then(handleGraphqlResponse)
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
      ...mainInfoFragment,
      ...imagesFragment
    }]
  )};

  return gqlRequest<typeof query>({
    query: mutation(graphqlParams({ $data: '[ItemInput!]!' }, query)),
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

  return gqlRequest({ query: `mutation { removeMockedData }` })
    .then(handleGraphqlResponse)
    .then(() => {
      batch(() => {
        dispatch(showToast(Toast.success, ITEMS_REMOVE_SUCCESS));
        dispatch(removeMockedData());
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(handleApiErrors(ITEMS_REMOVE_ERROR, CONTENT_LOADER_ID, dispatch));
};
