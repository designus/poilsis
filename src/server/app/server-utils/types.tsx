import { Request } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { ImageSize, DataTypes } from 'global-utils/typings';
import { CityInput } from 'input-types';
import { CitiesModelType, TypesModelType } from 'data-models';

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

export type Input = CityInput;

export type Model = CitiesModelType | TypesModelType;

export type Document = DocumentType<DataTypes>;
