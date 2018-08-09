export interface IAlias {
  alias: string;
  id: string;
}

export interface IGenericDataMap<T> {
  [key: string]: T;
}

export interface IGenericState<T> {
  aliases: IAlias[];
  dataMap: IGenericDataMap<T>;
}
