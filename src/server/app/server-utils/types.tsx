import { Request, Express } from 'express';
import { SchemaTypeOpts } from 'mongoose';

export enum FileUploadErrors {
  limitFileSize = 'LIMIT_FILE_SIZE',
  limitFileCount = 'LIMIT_FILE_COUNT',
  wrongFileType = 'WRONG_FILE_TYPE'
}

export type GenericSchemaMap<T> = {
  [I in keyof T]: SchemaTypeOpts<any>;
};

export type MulterRequest = Express.Request & Request;
export type MulterFile = Express.Multer.File;
