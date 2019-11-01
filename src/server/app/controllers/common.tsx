import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { ToggleEnabledParams } from 'types';
import { DataTypes, TranslatableField } from 'global-utils/typings';
import { getItemsByAliasesQuery } from 'server-utils/aliases';
import { IItemDocument, ICityDocument, ITypeDocument } from '../model';

type DocumentModelType = Model<IItemDocument | ICityDocument | ITypeDocument>;

export const toggleIsEnabledField = (DocumentModel: DocumentModelType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.body as ToggleEnabledParams;
      const { isEnabled, locale, id } = params;
      const document = await DocumentModel.findOne({ id });

      const item = document.toJSON() as DataTypes;

      if (!item.name[locale]) {
        throw new Error('Name field is empty');
      }

      document.isEnabled[locale] = isEnabled;
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

export const getDataByAlias = async (DocumentModel: DocumentModelType, alias: TranslatableField): Promise<DataTypes[]> => {
  const aliasValues = Object.values(alias).filter(Boolean);
  const documents = await DocumentModel.find(getItemsByAliasesQuery(aliasValues));
  return documents.map(item => (item.toJSON() as DataTypes));
};
