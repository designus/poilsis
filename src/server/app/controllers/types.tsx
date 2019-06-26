import { Request, Response, NextFunction } from 'express';
import { ITypeFields } from 'global-utils';

import { TypesModel } from '../model';
import { sendResponse, getAlias } from '../server-utils';

const shortId = require('shortid');

export const getAllTypes = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.find(sendResponse(res, next));
};

export const getType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOne({ id: req.params.typeId }, sendResponse(res, next));
};

export const addNewType = (req: Request, res: Response, next: NextFunction) => {
  const type: ITypeFields = req.body;
  const locale = req.headers['accept-language'] as string;
  const alias = getAlias(type, locale);
  const newType = { ...type, alias, id: shortId.generate() };

  new TypesModel(newType).save(sendResponse(res, next));
};

export const updateType = (req: Request, res: Response, next: NextFunction) => {
  const type: ITypeFields = req.body;
  const typeId = req.params.typeId;

  TypesModel.findOneAndUpdate({ id: typeId },  { $set: type }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const deleteType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOneAndRemove({ id: req.params.typeId }, sendResponse(res, next));
};
