import { MessageDescriptor } from 'react-intl';
import { ThunkAction, ThunkDispatch as Dispatch } from 'redux-thunk';
import { Action, Store } from 'redux';
import { Omit, DataTypes, TranslatableField } from 'global-utils/typings';
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
  [key: string]: MessageDescriptor;
};

export interface IToggleEnabled {
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED | CitiesActionTypes.TOGGLE_CITY_ENABLED | TypesActionTypes.TOGGLE_TYPE_ENABLED;
  id: string;
  isEnabled: boolean;
  locale: string;
}

export type ToggleEnabledParams = Omit<IToggleEnabled, 'type'>;

export type ThunkDispatch = Dispatch<IAppState, {}, Action>;

export type ThunkResult<T> = ThunkAction<T, IAppState, {}, Action>;

export type ThunkReturn<A> = A extends (...args: infer B) => infer C
  ? C extends (...args: any[]) => any
    ? (...args: B) => ReturnType<C>
    : never
  : never;

export type ActionReturn<A> = A extends (...args: infer B) => any
  ? (...args: B) => void
  : never;

export type ReduxStore = Store<IAppState, any>;
