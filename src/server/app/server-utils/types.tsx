import { SchemaTypeOpts } from 'mongoose';
export interface IMulterFile {
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
  filename: string;
  destination: string;
}

export enum FileUploadErrors {
  limitFileSize = 'LIMIT_FILE_SIZE',
  limitFileCount = 'LIMIT_FILE_COUNT',
  wrongFileType = 'WRONG_FILE_TYPE',
}

export type TGenericSchemaMap<T> = {
  [I in keyof T]: SchemaTypeOpts<any>;
};
