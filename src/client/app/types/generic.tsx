import { FormattedMessage } from 'react-intl';
import { Omit } from 'global-utils/typings';
import { ItemsActionTypes } from './items';
import { CitiesActionTypes } from './cities';
import { TypesActionTypes } from './types';

export interface IAliasMap {
  [key: string]: string;
}

export interface IGenericDataMap<T> {
  [key: string]: T;
}

export interface IGenericState<T> {
  aliases: IAliasMap;
  dataMap: IGenericDataMap<T>;
}

export type DropdownItemValue = string | number;

export interface IDropdownOption {
  label: string;
  value: DropdownItemValue;
}

export enum ActiveItem {
  Home,
  City,
  Type,
  Item
}

export type TranslatedMessages = {
  [key: string]: FormattedMessage.MessageDescriptor;
};

export interface IToggleEnabled {
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED | CitiesActionTypes.TOGGLE_CITY_ENABLED | TypesActionTypes.TOGGLE_TYPE_ENABLED;
  id: string;
  isEnabled: boolean;
  locale: string;
}

export type ToggleEnabledParams = Omit<IToggleEnabled, 'type'>;
