import { Request, Response } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { ImageSize, DataTypes } from 'global-utils/typings';
import { CityInput, MainInfoInput } from 'global-utils/input-types';
import { Image, CitiesModelType, TypesModelType, ItemsModelType } from 'global-utils/data-models';

export interface IInfoFromFileName {
  name: string;
  size: ImageSize;
  extension: string;
}

export type FieldsToSet = {
  [key: string]: string;
};

export type Input = CityInput | MainInfoInput;

export type Model = CitiesModelType | TypesModelType | ItemsModelType;

export type Document = DocumentType<DataTypes>;

export type Context = {
  req: Request;
  res: Response;
};

export type ParentPath = 'uploads' | 'testUploads';

export type EntityPath = 'items' | 'cities' | 'users' | 'tmp';

export type UploadedFile = Pick<Image, 'id' | 'fileName' | 'path' | 'thumbName'>;
