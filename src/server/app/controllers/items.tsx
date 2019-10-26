
import { Request, Response, NextFunction } from 'express';
import shortId from 'shortid';
import { IItem, itemValidation, getItemDescriptionFields, TranslatableField, LANGUAGES } from 'global-utils';
import { getImages, sendResponse, getAdjustedIsEnabledValue } from 'server-utils/methods';
import { uploadImages, resizeImages } from 'server-utils/middlewares';
import { getAdjustedAliasValue, getAliasList, getUniqueAlias, getItemsByAliasesQuery } from 'server-utils/aliases';

import { ItemsModel, IItemModel } from '../model';

const getItemsByAlias = async (alias: TranslatableField): Promise<IItem[]> => {
  const aliasValues = Object.values(alias).filter(Boolean);
  const documents: IItemModel[] = await ItemsModel.find(getItemsByAliasesQuery(aliasValues));
  return documents.map(item => (item.toJSON() as IItem));
};

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

export const toggleItemIsEnabledField = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isEnabled, locale } = req.body;
    const newItem = await ItemsModel.findOneAndUpdate(
      { id: req.params.itemId }, { $set: { [`isEnabled.${locale}`]: isEnabled } }, { new: true, runValidators: true }
    );

    if (!newItem) {
      throw new Error('Unable to enable item');
    }

    res.status(200).json(newItem);

  } catch (err) {
    return next(err);
  }
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
  const adjustedAlias = getAdjustedAliasValue(item, LANGUAGES) as TranslatableField;
  const alias = getUniqueAlias(await getItemsByAlias(adjustedAlias), id, adjustedAlias);
  const isEnabled = getAdjustedIsEnabledValue(item);

  const newItem = {
    ...item,
    alias,
    isEnabled,
    id
  };

  new ItemsModel(newItem).save(sendResponse(res, next));
};

export const getEditItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({ id: req.params.itemId }, sendResponse(res, next));
};

export const getViewItem = (req: Request, res: Response, next: NextFunction) => {
  const locale = req.headers['accept-language'] as string;
  ItemsModel.findOne({ [`alias.${locale}`]: req.params.alias }, sendResponse(res, next));
};

export const doesItemAliasExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item: IItem = req.body;
    const alias = getAdjustedAliasValue(item, LANGUAGES, next) as TranslatableField;
    const itemsByAlias = await getItemsByAlias(alias);
    const existingAliases = getAliasList(itemsByAlias, item.id);
    res.status(200).json(existingAliases.length > 0);
  } catch (err) {
    return next(err);
  }
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndRemove({id: req.params.itemId}, sendResponse(res, next));
};

export const updateMainInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item: IItem = req.body;
    const updatedAt = new Date();
    const adjustedAlias = getAdjustedAliasValue(item, LANGUAGES) as TranslatableField;
    const alias = getUniqueAlias(await getItemsByAlias(adjustedAlias), item.id, adjustedAlias);
    const isEnabled = getAdjustedIsEnabledValue(item);

    const updatedItem = {
      ...item,
      alias,
      isEnabled,
      updatedAt
    };

    const newItem = await ItemsModel.findOneAndUpdate(
      { id: req.params.itemId }, { $set: updatedItem }, { new: true, runValidators: true }
    );

    if (!newItem) {
      throw new Error('Unable to update item');
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
  const uploadPhotos = uploadImages.array('files[]', itemValidation.images.maxPhotos);
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
