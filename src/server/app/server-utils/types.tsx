import { Request } from 'express';
import { SchemaTypeOpts } from 'mongoose';
import { ImageSize } from 'global-utils/typings';

export type GenericSchemaMap<T> = {
  [I in keyof T]: SchemaTypeOpts<any>;
};

export type MulterRequest = Express.Request & Request;
export type MulterFile = Express.Multer.File;

export interface IInfoFromFileName {
  name: string;
  size: ImageSize;
  extension: string;
}
