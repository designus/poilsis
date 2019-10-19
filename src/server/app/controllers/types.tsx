import { Request, Response, NextFunction } from 'express';
import { IType, LANGUAGES, TranslatableField } from 'global-utils';
import shortId from 'shortid';

import { getUniqueAlias, getAlias, getItemsByAliasesQuery, getAliasList } from 'server-utils/aliases';
import { sendResponse } from 'server-utils/methods';
import { TypesModel, ITypeModel } from '../model';

const getTypesByAlias = async (alias: TranslatableField): Promise<IType[]> => {
  const aliasValues = Object.values(alias).filter(Boolean);
  const query = getItemsByAliasesQuery(aliasValues);
  const documents: ITypeModel[] = await TypesModel.find(query);
  return documents.map(item => (item.toJSON() as IType));
};

export const getAllTypes = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.find(sendResponse(res, next));
};

export const getType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOne({ id: req.params.typeId }, sendResponse(res, next));
};

export const addNewType = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const data: IType = req.body;
  const alias = getAlias(data, LANGUAGES) as TranslatableField;
  const newType = {
    id,
    ...data,
    alias: getUniqueAlias(await getTypesByAlias(alias), id, alias)
  };

  new TypesModel(newType).save(sendResponse(res, next));
};

export const updateType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: IType = req.body;
    const typeId = req.params.typeId;
    const alias = getAlias(data, LANGUAGES) as TranslatableField;
    const existingTypes = await getTypesByAlias(alias);
    const type = {
      ...data,
      alias: getUniqueAlias(existingTypes, data.id, alias)
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

export const doesTypeAliasExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type: IType = req.body;
    const alias = getAlias(type, LANGUAGES, next) as TranslatableField;
    const citiesByAlias = await getTypesByAlias(alias);
    const existingAliases = getAliasList(citiesByAlias, type.id);
    res.status(200).json(existingAliases.length > 0);
  } catch (err) {
    return next(err);
  }
};

export const deleteType = (req: Request, res: Response, next: NextFunction) => {
  TypesModel.findOneAndRemove({ id: req.params.typeId }, sendResponse(res, next));
};
