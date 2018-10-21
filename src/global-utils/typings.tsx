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

export interface ICityFields {
  id?: string;
  name: string;
  description: string;
  types: string[];
  alias: string;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}
