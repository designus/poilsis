import { IItem, IImage, IItemDescFields, IsEnabled } from 'global-utils/typings';
import { IGenericState, IAliasMap, IGenericDataMap } from './generic';

export type IItemsMap = IGenericDataMap<IItem>;

export interface IItemsState extends IGenericState<IItem> {}

export interface IUniqueItemProps {
  cityId?: string;
  userId?: string;
  dataType?: 'cities' | 'currentUser' | 'recommendedItems';
}

export enum ItemsActionTypes {
  RECEIVE_ITEMS = 'RECEIVE_ITEMS',
  RECEIVE_RECOMMENDED_ITEMS = 'RECEIVE_RECOMMENDED_ITEMS',
  RECEIVE_ITEM = 'RECEIVE_ITEM',
  RECEIVE_ITEM_DESCRIPTION = 'RECEIVE_ITEM_DESCRIPTION',
  REMOVE_ITEM = 'REMOVE_ITEM',
  RECEIVE_IMAGES = 'RECEIVE_IMAGES',
  TOGGLE_ITEM_ENABLED = 'TOGGLE_ITEM_ENABLED',
  TOGGLE_ITEM_RECOMMENDED = 'TOGGLE_ITEM_RECOMMENDED'
}

export interface IReceiveItems extends IUniqueItemProps {
  type: ItemsActionTypes.RECEIVE_ITEMS;
  dataMap: IItemsMap;
  aliases: IAliasMap;
}

export interface IReceiveItem {
  type: ItemsActionTypes.RECEIVE_ITEM;
  item: IItem;
}

export interface IReceiveItemDescription {
  type: ItemsActionTypes.RECEIVE_ITEM_DESCRIPTION;
  itemId: string;
  descFields: IItemDescFields;
}

export interface IRemoveItem {
  type: ItemsActionTypes.REMOVE_ITEM;
  itemId: string;
}

export interface IReceiveImages {
  type: ItemsActionTypes.RECEIVE_IMAGES;
  itemId: string;
  images: IImage[];
}

export interface IToggleItemEnabled {
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED;
  itemId: string;
  isEnabled: boolean;
  locale: string;
}

export interface IToggleItemRecommended {
  type: ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED;
  itemId: string;
  isRecommended: boolean;
}

export type ItemsActions = IReceiveItems
  | IReceiveItem
  | IReceiveItemDescription
  | IRemoveItem
  | IReceiveImages
  | IToggleItemEnabled
  | IToggleItemRecommended;
