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

export type TranslatableField = Record<Languages, string>;

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    }
  };
}

export interface IItemDescFields<T = TranslatableField> {
  description: T;
  metaTitle: T;
  metaKeywords: T;
  metaDescription: T;
}

export interface IItem<T = TranslatableField> extends IItemDescFields<T> {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  address: string;
  cityId: string;
  types: string[];
  images: IImage[];
  userId: string;
  isEnabled: boolean;
  isRecommended: boolean;
  name: T;
  alias: T;
  isFullyLoaded?: boolean;
  mainImage?: string;
}

export interface IType<T = TranslatableField> {
  id: string;
  name: T;
  description: T;
  alias: T;
}

export interface ICity<T = TranslatableField> {
  id: string;
  types: string[];
  name: T;
  description: T;
  alias: string;
  hasItems?: boolean;
}

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
