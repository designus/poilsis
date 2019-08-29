export interface IAlias<T = string> {
  alias: T;
  id: string;
}

export interface IGenericDataMap<T> {
  [key: string]: T;
}

export interface IGenericState<T, U = string> {
  aliases: Array<IAlias<U>>;
  dataMap: IGenericDataMap<T>;
}

export type DropdownItemValue = string | number;

export interface IDropdownOption {
  label: string;
  value: DropdownItemValue;
}
