import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { ToggleEnabledParams } from 'types';
import { DataTypes } from 'global-utils/typings';
import { IItemDocument, ICityDocument } from '../model';

export const toggleIsEnabledField = (DocumentModel: Model<IItemDocument | ICityDocument>) =>
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
