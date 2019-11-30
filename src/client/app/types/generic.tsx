import { FormattedMessage } from 'react-intl';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction, Dispatch, Action } from 'redux';
import { Omit } from 'global-utils/typings';
import { ItemsActionTypes } from './items';
import { CitiesActionTypes } from './cities';
import { TypesActionTypes } from './types';
import { IAppState } from './appState';

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

export type ThunkDispatch = ThunkDispatch<IAppState, {}, Action>;

export type ThunkResult<T> = ThunkAction<T, IAppState, {}, Action>;

export type ThunkReturn<A> = A extends (...args: infer B) => infer C
  ? C extends (...args: any[]) => any
    ? (...args: B) => ReturnType<C>
    : never
  : never;
