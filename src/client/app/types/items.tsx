import { IItem, IImage } from 'global-utils/typings';
import { IGenericState, IGenericDataMap } from './generic';
import {
  receiveItems,
  receiveItem,
  receiveItemDescription,
  removeItem,
  removeMockedData,
  receiveMockedData,
  receiveImages,
  toggleItemEnabledField,
  toggleItemApprovedField,
  toggleItemRecommendedField
} from 'actions/items';

export type IItemsMap = IGenericDataMap<IItem>;

export interface IItemsState extends IGenericState<IItem> {}

export enum ItemsActionTypes {
  RECEIVE_ITEMS = 'RECEIVE_ITEMS',
  RECEIVE_RECOMMENDED_ITEMS = 'RECEIVE_RECOMMENDED_ITEMS',
  RECEIVE_ITEM = 'RECEIVE_ITEM',
  RECEIVE_ITEM_DESCRIPTION = 'RECEIVE_ITEM_DESCRIPTION',
  REMOVE_ITEM = 'REMOVE_ITEM',
  REMOVE_MOCKED_DATA = 'REMOVE_MOCKED_DATA',
  RECEIVE_MOCKED_DATA = 'RECEIVE_MOCKED_DATA',
  RECEIVE_IMAGES = 'RECEIVE_IMAGES',
  TOGGLE_ITEM_ENABLED = 'TOGGLE_ITEM_ENABLED',
  TOGGLE_ITEM_RECOMMENDED = 'TOGGLE_ITEM_RECOMMENDED',
  TOGGLE_ITEM_APPROVED_BY_ADMIN = 'TOGGLE_ITEM_APPROVED_BY_ADMIN'
}

export interface IReceiveImages {
  type: ItemsActionTypes.RECEIVE_IMAGES;
  itemId: string;
  images: IImage[];
  mainImage: string | null;
}

export type ItemsActions =
  | ReturnType<typeof receiveItems>
  | ReturnType<typeof receiveItem>
  | ReturnType<typeof receiveItemDescription>
  | ReturnType<typeof removeItem>
  | ReturnType<typeof removeMockedData>
  | ReturnType<typeof receiveMockedData>
  | ReturnType<typeof receiveImages>
  | ReturnType<typeof toggleItemEnabledField>
  | ReturnType<typeof toggleItemApprovedField>
  | ReturnType<typeof toggleItemRecommendedField>;
