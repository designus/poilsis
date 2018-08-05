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
  address?: string;
  cityId?: string;
  description?: string;
  name?: string;
  types?: string[];
  images?: IImage[];
  userId?: string;
  alias?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITypeFields {
  id?: string;
  name: string;
  description: string;
  alias: string;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}
