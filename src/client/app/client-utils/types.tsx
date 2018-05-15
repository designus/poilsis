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

export type TGenericFormErrors<T> = {
  [I in keyof T]?: string[]
};

export type TGenericSchemaMap<T> = {
  [I in keyof T]: any;
};

export interface IGenericFormState<T> {
  fields: T;
  errors: TGenericFormErrors<T>;
  showErrors: boolean;
  model: TGenericFormModel<T>;
};

export type ValueType = string|string[];

export interface IKeyMap {
  value: ValueType;
  title: string;
  validators: Array<() => void>;
}

export type TGenericFormModel<T> = {
  [I in keyof T]: IKeyMap
};

export interface IFormProps {
  initialState?: IGenericFormState<object>;
  onItemSubmit?: (fields: {[key: string]: any}) => void;
  onSaveState?: (state: IGenericFormState<object>) => void;
  handleSubmit?: any;
  handleOnBlur?: any;
  handleInputChange?: (key: string) => (event) => void;
  handleCheckboxToggle?: any;
  loaderId?: string;
  showLoadingOverlay?: boolean;
  setNewState?: (key: string) => (value: any) => void;
  state?: IGenericFormState<object>;
}

export type IGenericModelSchema<T> = {
  [I in keyof T]: any;
};

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}
