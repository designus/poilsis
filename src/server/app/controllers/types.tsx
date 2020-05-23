import { Request, Response, NextFunction } from 'express';
import { LANGUAGES, Locale, ToggleFields } from 'global-utils';
import { TypesModel, TranslatableField, Type } from 'data-models';
import shortId from 'shortid';

import { getUniqueAlias, getAdjustedAliasValue } from 'server-utils/aliases';
import { sendResponse, getAdjustedIsEnabledValue, getFieldsToUnset, getFieldsToSet } from 'server-utils/methods';
import { getDataByAlias } from './common';

export const getClientTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.headers['accept-language'] as Locale;

    if (!locale) throw new Error('Locale is not set');

    const toggleFields: ToggleFields<Type> = ['name', 'isEnabled', 'alias', 'description'];
    const types = await TypesModel.aggregate([
      { $project: { _id: 0, __v: 0 } },
      { $unset: getFieldsToUnset<Type>(LANGUAGES, locale, toggleFields) },
      { $set: getFieldsToSet<Type>(locale, toggleFields)}
    ])
    .exec();

    if (!types) throw new Error('Unable to load types');

    res.status(200).json(types);

  } catch (err) {
    return next(err);
  }
};

export const getAdminTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const types = await TypesModel.aggregate([
      { $project: { _id: 0, __v: 0 } }
    ])
    .exec();

    if (!types) throw new Error('Unable to load types');

    res.status(200).json(types);

  } catch (err) {
    return next(err);
  }
};

export const getType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOne({ id: req.params.typeId }, sendResponse(res, next));
};

export const addNewType = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const data: Type = req.body;
  const alias = getAdjustedAliasValue(data);
  const typesByAlias = await getDataByAlias(TypesModel, alias);
  const isEnabled = getAdjustedIsEnabledValue(data, LANGUAGES);
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
    const data: Type = req.body;
    const typeId = req.params.typeId;
    const alias = getAdjustedAliasValue(data);
    const typesByAlias = await getDataByAlias(TypesModel, alias);
    const isEnabled = getAdjustedIsEnabledValue(data, LANGUAGES);
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
