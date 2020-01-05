export interface IImage {
  id?: string;
  name?: string;
  fileName?: string;
  path?: string;
  thumbName?: string;
  preview?: string;
}

export enum ImageSize {
  Small = 'S',
  Medium = 'M',
  Large = 'L'
}

export type Languages = 'en' | 'lt' | 'ru';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Value<T, K extends keyof T> = T[K];

export type IntlSetting<T> = Partial<Record<Languages, T>>;

export type TranslatableField = IntlSetting<string>;

export type IsEnabled = IntlSetting<boolean>;

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    }
  };
}

export interface ISeoFields {
  metaTitle: TranslatableField;
  metaDescription: TranslatableField;
}

export interface IItemDescFields extends ISeoFields {
  description: TranslatableField;
}

export interface IItem extends IItemDescFields {
  id: string;
  alias: TranslatableField;
  name: TranslatableField;
  address: string;
  cityId: string;
  types: string[];
  images: IImage[];
  userId: string;
  isRecommended: boolean;
  isEnabled: IsEnabled;
  isApprovedByAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
  isFullyLoaded?: boolean;
  mainImage: string;
}

export interface IType {
  id: string;
  alias?: TranslatableField;
  name: TranslatableField;
  description: TranslatableField;
  isEnabled: IsEnabled;
}

export interface ICity extends ISeoFields {
  id: string;
  alias?: TranslatableField;
  types: string[];
  name: TranslatableField;
  description: TranslatableField;
  hasItems?: boolean;
  isEnabled: IsEnabled;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user'
}

export interface IAccessTokenClaims {
  exp: number;
  userName: string;
  userId: string;
  userRole: UserRoles;
  userItems: string[];
}

export interface IPhotoFormState {
  files?: File[];
}

export interface IUser {
  id: string;
  name: string;
  role: UserRoles;
  alias: string;
  isEnabled: boolean;
}

export type DataTypes = IItem | IType | ICity;

export interface IConfig {
  env: 'development' | 'production' | 'test';
  db: string;
  port: string | number;
  host?: string;
}
