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

export interface IResponseError {
  errors: {
    [key: string]: {
      message: string;
    },
  };
}

export interface IItemFields {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  address: string;
  cityId: string;
  description: string;
  name: string;
  types: string[];
  images: IImage[];
  userId: string;
  alias: string;
  isEnabled: boolean;
}

export interface ITypeFields {
  id?: string;
  name: string;
  description: string;
  alias: string;
}

export type TranslatableField = Record<'en' | 'lt' | 'ru', string>;

export interface ICityFieldsAbstract {
  id: string;
  types: string[];
}

export interface ICityFieldsLocalized extends ICityFieldsAbstract {
  name: string;
  description: string;
  alias: string;
}

export interface ICityFields extends ICityFieldsAbstract {
  name: TranslatableField;
  description: TranslatableField;
  alias: TranslatableField;
}

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
