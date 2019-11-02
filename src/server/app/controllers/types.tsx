import { Request, Response, NextFunction } from 'express';
import { IType, LANGUAGES, TranslatableField } from 'global-utils';
import shortId from 'shortid';

import { getUniqueAlias, getAdjustedAliasValue, getAliasList } from 'server-utils/aliases';
import { sendResponse, getAdjustedIsEnabledValue } from 'server-utils/methods';
import { TypesModel } from '../model';
import { getDataByAlias } from './common';

export const getAllTypes = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.find(sendResponse(res, next));
};

export const getType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOne({ id: req.params.typeId }, sendResponse(res, next));
};

export const addNewType = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const data: IType = req.body;
  const alias = getAdjustedAliasValue(data, LANGUAGES) as TranslatableField;
  const typesByAlias = await getDataByAlias(TypesModel, alias);
  const isEnabled = getAdjustedIsEnabledValue(data);
  const newType = {
    ...data,
    alias: getUniqueAlias(typesByAlias, id, alias),
    isEnabled,
    id
  };

  new TypesModel(newType).save(sendResponse(res, next));
};

export const updateType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: IType = req.body;
    const typeId = req.params.typeId;
    const alias = getAdjustedAliasValue(data, LANGUAGES) as TranslatableField;
    const typesByAlias = await getDataByAlias(TypesModel, alias);
    const isEnabled = getAdjustedIsEnabledValue(data);
    const type = {
      ...data,
      alias: getUniqueAlias(typesByAlias, data.id, alias),
      isEnabled
    };

    const updatedType = await TypesModel.findOneAndUpdate({ id: typeId }, { $set: type }, { new: true, runValidators: true });

    if (!updatedType) {
      throw new Error('Unable to update type');
    }

    res.status(200).json(updatedType);
  } catch (err) {
    return next(err);
  }
};

export const deleteType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOneAndRemove({ id: req.params.typeId }, sendResponse(res, next));
};
