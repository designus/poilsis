import { IItem, IImage, IItemDescFields } from 'global-utils/typings';
import { IGenericState, IAliasMap, IGenericDataMap } from './generic';

export type IItemsMap = IGenericDataMap<IItem>;

export interface IItemLocalized extends IItem<string> {}

export interface IItemsState extends IGenericState<IItem> {
  selectedId?: string;
}

export interface IUniqueItemProps {
  cityId?: string;
  userId?: string;
  dataType?: 'cities' | 'currentUser' | 'recommendedItems';
}

export enum ItemsActionTypes {
  RECEIVE_ITEMS = 'RECEIVE_ITEMS',
  RECEIVE_RECOMMENDED_ITEMS = 'RECEIVE_RECOMMENDED_ITEMS',
  SELECT_ITEM = 'SELECT_ITEM',
  RECEIVE_ITEM = 'RECEIVE_ITEM',
  RECEIVE_ITEM_DESCRIPTION = 'RECEIVE_ITEM_DESCRIPTION',
  CLEAR_SELECTED_ITEM = 'CLEAR_SELECTED_ITEM',
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

export interface ISelectItem {
  type: ItemsActionTypes.SELECT_ITEM;
  itemId: string;
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

export interface IClearSelectedItem {
  type: ItemsActionTypes.CLEAR_SELECTED_ITEM;
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
}

export interface IToggleItemRecommended {
  type: ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED;
  itemId: string;
  isRecommended: boolean;
}

export type ItemsActions = IReceiveItems
  | ISelectItem
  | IReceiveItem
  | IReceiveItemDescription
  | IClearSelectedItem
  | IRemoveItem
  | IReceiveImages
  | IToggleItemEnabled
  | IToggleItemRecommended;
