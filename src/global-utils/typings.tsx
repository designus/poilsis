export interface IImage {
  id?: string;
  name?: string;
  fileName?: string;
  path?: string;
  thumbName?: string;
}

export enum ImageSize {
  Small = 'S',
  Medium = 'M',
  Large = 'L',
}

export type TranslatableField = Record<'en' | 'lt' | 'ru', string>;

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    },
  };
}

export interface IItemFields<T = string> {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  address: string;
  cityId: string;
  types: string[];
  images: IImage[];
  userId: string;
  isEnabled: boolean;
  name: T;
  alias: T;
  description: T;
}

export type TItemFields = IItemFields<TranslatableField>;

export interface ITypeFields<T = string> {
  id: string;
  name: T;
  description: T;
  alias: T;
}

export type TTypeFields = ITypeFields<TranslatableField>;

export interface ICityFields<T = string> {
  id: string;
  types: string[];
  name: T;
  description: T;
  alias: T;
}

export type TCityFields = ICityFields<TranslatableField>;

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}

export interface IAccessTokenClaims {
  expires: number;
  userId: string;
  userRole: string;
  userItems: string[];
}
