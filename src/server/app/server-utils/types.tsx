import { Request } from 'express';
import { ImageSize } from 'global-utils/typings';

export type MulterRequest = Express.Request & Request;
export type MulterFile = Express.Multer.File;

export interface IInfoFromFileName {
  name: string;
  size: ImageSize;
  extension: string;
}

export type FieldsToSet = {
  [key: string]: string;
};
