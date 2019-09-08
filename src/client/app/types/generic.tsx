export interface IAlias {
  [key: string]: string;
}

export interface IGenericDataMap<T> {
  [key: string]: T;
}

export interface IGenericState<T> {
  aliases: IAlias;
  dataMap: IGenericDataMap<T>;
}

export type DropdownItemValue = string | number;

export interface IDropdownOption {
  label: string;
  value: DropdownItemValue;
}
