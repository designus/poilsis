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

export type TranslatableField = Partial<Record<Languages, string>>;

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    }
  };
}

export interface IItemDescFields {
  description: TranslatableField;
  metaTitle: TranslatableField;
  metaKeywords: TranslatableField;
  metaDescription: TranslatableField;
}

export interface IItem extends IItemDescFields {
  id?: string;
  alias?: TranslatableField;
  name: TranslatableField;
  address: string;
  cityId: string;
  types: string[];
  images: IImage[];
  userId: string;
  isRecommended: boolean;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  isFullyLoaded?: boolean;
  mainImage?: string;
}

export interface IType {
  id: string;
  alias?: TranslatableField;
  name: TranslatableField;
  description: TranslatableField;
}

export interface ICity {
  id: string;
  alias?: TranslatableField;
  types: string[];
  name: TranslatableField;
  description: TranslatableField;
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

export interface IUser {
  id: string;
  name: string;
  role: string;
  alias: string;
}

export type DataTypes = IItem | IType | ICity;
