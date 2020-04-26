import { Item, Type, City, User, TranslatableField } from 'data-models';

export enum ImageSize {
  Small = 'S',
  Medium = 'M',
  Large = 'L'
}

export type Locale = 'en' | 'lt' | 'ru';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Value<T, K extends keyof T> = T[K];

export type IntlSetting<T> = Record<Locale, T>;

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    }
  };
}

export type IItemDescFields = Pick<Item, 'description' | 'metaDescription' | 'metaTitle'>;

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

export type IUser = Pick<User, 'id' | 'name' | 'role' | 'isEnabled' | 'alias'>;

export type DataTypes = Item | Type | City | IUser;

export interface IConfig {
  env: 'development' | 'production' | 'test';
  db: string;
  port: string | number;
  host?: string;
}

export type TranslatableFields<O, K = keyof O> = K extends keyof O
  ? O[K] extends (TranslatableField | string | undefined)
    ? K
    : K extends 'isEnabled' ? K : never
  : never;

export type ToggleFields<T> = Array<TranslatableFields<T>>;

export type ObjectKeys<T> = Array<keyof T>;
