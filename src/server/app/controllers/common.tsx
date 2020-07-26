import { Request, Response, NextFunction } from 'express';
import { ReturnModelType } from '@typegoose/typegoose';
import { EnableInput } from 'global-utils/input-types';
import { DataTypes } from 'global-utils/typings';
import { getItemsByAliasesQuery, getAdjustedAliasValue, getAliasList } from 'server-utils/aliases';
import { Item, City, Type, TranslatableField, IsEnabled } from 'global-utils/data-models';

type DocumentModelType = ReturnModelType<typeof Item | typeof City | typeof Type>;

export const toggleEnabled = (DocumentModel: DocumentModelType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.body as EnableInput;
      const { isEnabled, locale, id } = params;
      const document = await DocumentModel.findOne({ id });

      if (!document) {
        throw new Error('Item not found');
      }

      const item = document.toJSON() as DataTypes;

      if (!(item.name as TranslatableField)[locale]) {
        throw new Error('Name field is empty');
      }

      (document.isEnabled as IsEnabled)[locale] = isEnabled;
      document.markModified('isEnabled');

      // @ts-ignore
      const updatedItem = await document.save();

      if (!updatedItem) {
        throw new Error('Unable to enable item');
      }

      res.status(200).json(true);

    } catch (err) {
      return next(err);
    }
  };

export const doesAliasExist = (DocumentModel: DocumentModelType) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: DataTypes = req.body;
    const alias = getAdjustedAliasValue(data);
    const typesByAlias = await getDataByAlias(DocumentModel, alias);
    const existingAliases = getAliasList(typesByAlias, data.id);
    res.status(200).json(existingAliases.length > 0);
  } catch (err) {
    return next(err);
  }
};

// TODO: remove deprecated
export const getDataByAlias = async (DocumentModel: DocumentModelType, alias: TranslatableField): Promise<DataTypes[]> => {
  const aliasValues = Object.values(alias).filter(Boolean);
  const documents = await DocumentModel.find(getItemsByAliasesQuery(aliasValues));
  return documents.map(item => (item.toJSON() as DataTypes));
};
