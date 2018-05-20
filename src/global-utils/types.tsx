export interface IImage {
  id?: string;
  name?: string;
  order?: number;
  fileName?: string;
  path?: string;
  thumbName?: string;
  preview?: string;
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

export interface IMainInfoFields {
  id?: string;
  address?: string;
  alias?: string;
  city?: string;
  name?: string;
  types?: string[];
  userId?: string;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}

export const isAdmin = (userRole: string) => userRole === UserRoles.admin;
