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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TranslatableField = Record<'en' | 'lt' | 'ru', string>;

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    }
  };
}

export interface IItemDescFields<T = string> {
  description: T;
  metaTitle: T;
  metaKeywords: T;
  metaDescription: T;
}

export interface IItemFields<T = string> extends IItemDescFields<T> {
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
}

export type TItemFields = IItemFields<TranslatableField>;

export type TItemDescFields = IItemDescFields<TranslatableField>;

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
  user = 'user'
}

export interface IAccessTokenClaims {
  expires: number;
  userName: string;
  userId: string;
  userRole: string;
  userItems: string[];
}

export interface IPhotoFormState {
  files?: File[];
}
