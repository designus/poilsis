import { flatten } from 'lodash';
import { Schema, Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { IItem, itemValidation, getItemDescriptionFields, TranslatableField } from 'global-utils';
import { ItemsModel, IItemModel } from '../model';
import {
  uploadImages,
  resizeImages,
  getImages,
  sendResponse,
  formatAlias,
  getAlias,
  extendAliasWithId
} from '../server-utils';

const { images: { maxPhotos } } = itemValidation;

const shortId = require('shortid');

const mainImageProjection = {
  $let: {
    vars: {
      firstImage: {
        $arrayElemAt: ['$images', 0]
      }
    },
    in: {
      $concat: ['$$firstImage.path', '/', '$$firstImage.thumbName']
    }
  }
};

const itemProjection =  {
  _id: 0,
  id: 1,
  name: 1,
  alias: 1,
  types: 1,
  address: 1,
  userId: 1,
  cityId: 1,
  isEnabled: 1,
  isRecommended: 1,
  mainImage: mainImageProjection
};

export const getAllItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel
    .aggregate([
      {
        $addFields: {
          mainImage: mainImageProjection
        }
      }
    ])
    .exec(sendResponse(res, next));
};

export const getRecommendedItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel
    .aggregate([
      { $match: { isRecommended: true } },
      { $project: itemProjection }
    ])
    .exec(sendResponse(res, next));
};

export const getCityItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel
    .aggregate([
      { $match: { cityId: req.params.cityId } },
      { $project: itemProjection }
    ])
    .exec(sendResponse(res, next));
};

export const getUserItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel
    .aggregate([
      { $match: req.params.userId },
      {
        $addFields: {
          mainImage: mainImageProjection
        }
      }
    ])
    .exec(sendResponse(res, next));
};

export const toggleItemIsEnabledField = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: { isEnabled: req.body.isEnabled } }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const toggleItemIsRecommendedField = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: { isRecommended: req.body.isRecommended } }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const item: IItem = req.body;
  const alias: any = getAlias(item);

  const newItem = { id, alias, ...item };

  new ItemsModel(newItem).save(sendResponse(res, next));
};

export const getEditItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({ id: req.params.itemId }, sendResponse(res, next));
};

export const getViewItem = (req: Request, res: Response, next: NextFunction) => {
  const locale = req.headers['accept-language'] as string;
  ItemsModel.findOne({ [`alias.${locale}`]: req.params.alias }, sendResponse(res, next));
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndRemove({id: req.params.itemId}, sendResponse(res, next));
};

export const updateMainInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateItem: IItem = req.body;
    const updatedAt = new Date();
    const alias = getAlias(updateItem);

    const aliasValues = Object.values(alias);
    const query = Object.keys(alias).map(locale => ({
      [`alias.${locale}`]: { $in: aliasValues }
    }));

    const documents: IItemModel[] = await ItemsModel.find({ $or: query });
    const itemsByAlias = documents.map(item => (item.toJSON() as IItem));

    const existingAliases = itemsByAlias
      .filter(item => item.id !== updateItem.id)
      .map(item => Object.values(item.alias))
      .reduce((acc: string[], val: string[]) => acc.concat(val), []);

    const newAlias = existingAliases.length > 0
      ? extendAliasWithId(alias, updateItem.id, existingAliases)
      : alias;

    const updatedItem = { ...updateItem, alias: newAlias, updatedAt };

    const newItem = await ItemsModel.findOneAndUpdate(
      { id: req.params.itemId }, { $set: updatedItem }, { new: true, runValidators: true }
    );

    if (!newItem) {
      throw new Error('Unable to create a new item');
    }

    res.status(200).json(newItem);

  } catch (err) {
    return next(err);
  }
};

export const updateItemDescription = (req: Request, res: Response, next: NextFunction) => {
  const fields = getItemDescriptionFields(req.body);
  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId },
    { $set: fields },
    { new: true, runValidators: true },
    (err, result: IItem) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(getItemDescriptionFields(result));
    }
  );
};

export const updatePhotos = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({id: req.params.itemId}, (err, item) => {
    if (err) {
      // TODO: Rollback deleted files
      return next(err);
    }

    item.images = req.body.images;

    item.save((err, item) => {
      if (err) {
        // TODO: Rollback deleted files
        return next(err);
      }

      res.send(item.images);
    });
  });
};

export const uploadPhotos = (req, res: Response, next: NextFunction) => {
  const uploadPhotos = uploadImages.array('files[]', maxPhotos);
  uploadPhotos(req, res, (err) => {
    if (err) { return next(err); }

    resizeImages(req, res)
      .then(() => {
        const images = getImages(req.files);

        ItemsModel.findOne({id: req.params.itemId}, (err, item) => {
          if (err) {
            // TODO: Remove uploaded files
            return next(err);
          }

          item.images = [...(item.images || []), ...images];

          item.save((err, item) => {
            if (err) {
              // TODO: Remove uploaded files
              return next(err);
            }

            res.send(item.images);
          });
        });
      })
      .catch(err => {
        // TODO: Remove uploaded files
        console.log('Upload photos err: ', err);
      });
  });
};
