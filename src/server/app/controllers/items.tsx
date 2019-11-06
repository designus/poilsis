
import { Request, Response, NextFunction } from 'express';
import shortId from 'shortid';
import { IItem, itemValidation, getItemDescriptionFields, TranslatableField, LANGUAGES } from 'global-utils';
import { getImages, sendResponse, getAdjustedIsEnabledValue, isApprovedByAdmin, getImagePath } from 'server-utils/methods';
import { uploadImages, resizeImages } from 'server-utils/middlewares';
import { getAdjustedAliasValue, getUniqueAlias } from 'server-utils/aliases';
import { MulterRequest, MulterFile } from 'server-utils/types';
import { getDataByAlias } from './common';
import { ItemsModel } from '../model';

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
  createdAt: 1,
  updatedAt: 1,
  isApprovedByAdmin: 1,
  mainImage: 1
};

export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allItems = await ItemsModel.find({});
    res.status(200).json(allItems);
  } catch (err) {
    return next(err);
  }
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

export const getUserItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userItems = await ItemsModel.find({ id: req.params.id });
    res.status(200).json(userItems);
  } catch (err) {
    return next(err);
  }
};

export const toggleItemRecommended = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.body.itemId }, { $set: { isRecommended: req.body.isRecommended } }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const toggleItemApproved = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.body.itemId }, { $set: { isApprovedByAdmin: req.body.isApproved } }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const item: IItem = req.body;
  const adjustedAlias = getAdjustedAliasValue(item, LANGUAGES) as TranslatableField;
  const itemsByAlias = await getDataByAlias(ItemsModel, adjustedAlias);
  const alias = getUniqueAlias(itemsByAlias, id, adjustedAlias);
  const isEnabled = getAdjustedIsEnabledValue(item);

  const newItem: IItem = {
    ...item,
    alias,
    isEnabled,
    isApprovedByAdmin: isApprovedByAdmin(req.body.userRole, item),
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

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndRemove({id: req.params.itemId}, sendResponse(res, next));
};

export const updateMainInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item: IItem = req.body;
    const updatedAt = new Date().toUTCString();
    const adjustedAlias = getAdjustedAliasValue(item, LANGUAGES) as TranslatableField;
    const itemsByAlias = await getDataByAlias(ItemsModel, adjustedAlias);
    const alias = getUniqueAlias(itemsByAlias, item.id, adjustedAlias);
    const isEnabled = getAdjustedIsEnabledValue(item);

    const updatedItem: IItem = {
      ...item,
      alias,
      isEnabled,
      updatedAt,
      isApprovedByAdmin: isApprovedByAdmin(req.body.userRole, item)
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

export const updateItemDescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fields = getItemDescriptionFields(req.body);
    const result = await ItemsModel.findOneAndUpdate({ id: req.params.itemId }, { $set: fields }, { new: true, runValidators: true });
    res.status(200).json(getItemDescriptionFields(result.toJSON() as IItem));
  } catch (err) {
    return next(err);
  }
};

export const updatePhotos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await ItemsModel.findOne({ id: req.params.itemId });

    if (!item) {
      throw new Error('Unable to find item by provided itemId');
    }

    item.images = req.body.images;
    item.mainImage = getImagePath(item.images[0]);

    const newItem = await item.save();

    if (!newItem) {
      throw new Error('Unable to update item images');
    }

    res.status(200).json(newItem);

  } catch (err) {
    return next(err);
  }
};

export const uploadPhotos = (req: MulterRequest, res: Response, next: NextFunction) => {
  const uploadPhotos = uploadImages.array('files[]', itemValidation.images.maxPhotos);

  uploadPhotos(req, res, async (err) => {
    if (err) { return next(err); }

    try {
      await resizeImages(req, res);
      const files = req.files as MulterFile[];
      const newImages = getImages(files);
      const item = await ItemsModel.findOne({ id: req.params.itemId });

      if (!item) {
        throw new Error('Unable to find item by provided itemId');
      }

      item.images = [...(item.images || []), ...newImages];
      item.mainImage = getImagePath(item.images[0]);

      const updatedItem = await item.save();

      if (!updatedItem) {
        throw new Error('Unable to update item images');
      }

      res.status(200).json(item);

    } catch (err) {
      // TODO: Remove uploaded files
      console.log('Error', err);
      return next(err);
    }
  });
};
