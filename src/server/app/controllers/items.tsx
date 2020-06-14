
import { Request, Response, NextFunction, response } from 'express';
import shortId from 'shortid';
import { itemValidation, getItemDescriptionFields, LANGUAGES, ToggleFields, Locale } from 'global-utils';
import {
  getImages,
  sendResponse,
  getAdjustedIsEnabledValue,
  isApprovedByAdmin,
  getImagePath,
  removeUploadedFiles,
  getFieldsToSet,
  getFieldsToUnset
} from 'server-utils/methods';
import { ItemsModel, TranslatableField, Item } from 'global-utils/data-models';
import { uploadImages, resizeImages } from 'server-utils/middlewares';
import { getAdjustedAliasValue, getUniqueAlias } from 'server-utils/aliases';
import { MulterRequest, MulterFile } from 'server-utils/types';
import { config } from 'config';
import { getDataByAlias } from './common';

const clientItemsProjection = {
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
  mainImage: 1,
  price: 1,
  currency: 1
};

const adminItemsProjection = {
  ...clientItemsProjection,
  createdAt: 1,
  updatedAt: 1
};

export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allItems = await ItemsModel.aggregate([
      { $project: clientItemsProjection }
    ]);

    if (!allItems) throw new Error('Unable to load all items');

    res.status(200).json(allItems);
  } catch (err) {
    return next(err);
  }
};

export const getRecommendedItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.headers['accept-language'] as Locale;

    if (!locale) throw new Error('Locale is not set');

    const toggleFields: ToggleFields<Item> = ['name', 'alias', 'isEnabled'];
    const recommendedItems = await ItemsModel.aggregate([
      { $match: { isRecommended: true } },
      { $project: clientItemsProjection },
      { $unset: getFieldsToUnset<Item>(LANGUAGES, locale, toggleFields) },
      { $set: getFieldsToSet<Item>(locale, toggleFields)}
    ])
    .exec();

    res.status(200).json(recommendedItems);
  } catch (err) {
    return next(err);
  }
};

export const getCityItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.headers['accept-language'] as Locale;
    const toggleFields: ToggleFields<Item> = ['name', 'alias', 'isEnabled'];
    const cityItems = await ItemsModel
      .aggregate([
        { $match: { cityId: req.params.cityId } },
        { $project: clientItemsProjection },
        { $unset: getFieldsToUnset<Item>(LANGUAGES, locale, toggleFields) },
        { $set: getFieldsToSet<Item>(locale, toggleFields)}
      ])
      .exec();

    res.status(200).json(cityItems);
  } catch (err) {
    return next(err);
  }
};

export const getUserItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userItems = await ItemsModel.aggregate([
      { $project: adminItemsProjection }
    ]);

    res.status(200).json(userItems);
  } catch (err) {
    return next(err);
  }
};

export const toggleItemRecommended = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await ItemsModel.findOneAndUpdate(
      { id: req.body.itemId }, { $set: { isRecommended: req.body.isRecommended } }, { new: true, runValidators: true }
    );

    if (!item) {
      throw new Error('Unable to update item state');
    }

    response.status(200).json(true);

  } catch (err) {
    return next(err);
  }
};

export const toggleItemApproved = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await ItemsModel.findOneAndUpdate(
      { id: req.body.itemId }, { $set: { isApprovedByAdmin: req.body.isApproved } }, { new: true, runValidators: true }
    );

    if (!item) {
      throw new Error('Unable to update item state');
    }

    res.status(200).json(true);

  } catch (err) {
    return next(err);
  }
};

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const item: Item = req.body;
  const adjustedAlias = getAdjustedAliasValue(item, LANGUAGES);
  const itemsByAlias = await getDataByAlias(ItemsModel, adjustedAlias);
  const alias = getUniqueAlias(itemsByAlias, id, adjustedAlias);
  const isEnabled = getAdjustedIsEnabledValue(item, LANGUAGES);

  const newItem: Item = {
    ...item,
    alias,
    isEnabled,
    isApprovedByAdmin: isApprovedByAdmin(req.body.userRole, item),
    id
  };

  new ItemsModel(newItem).save(sendResponse(res, next));
};

export const getAdminItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({ id: req.params.itemId }, sendResponse(res, next));
};

export const getClientItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.headers['accept-language'] as Locale;
    const toggleFields: ToggleFields<Item> = ['name', 'alias', 'isEnabled', 'metaTitle', 'metaDescription', 'description'];

    if (!locale) throw new Error('Locale is not set');

    const item = await ItemsModel.aggregate([
      { $match: { [`alias.${locale}`]: req.params.alias } },
      { $project: {_id: 0, __v: 0 } },
      { $unset: getFieldsToUnset<Item>(LANGUAGES, locale, toggleFields) },
      { $set: getFieldsToSet<Item>(locale, toggleFields)}
    ])
    .then(items => items[0]);

    res.status(200).json(item);

  } catch (err) {
    return next(err);
  }
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndRemove({id: req.params.itemId}, sendResponse(res, next));
};

export const updateMainInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item: Item = req.body;
    const updatedAt = new Date().toUTCString();
    const adjustedAlias = getAdjustedAliasValue(item);
    const itemsByAlias = await getDataByAlias(ItemsModel, adjustedAlias);
    const alias = getUniqueAlias(itemsByAlias, item.id, adjustedAlias);
    const isEnabled = getAdjustedIsEnabledValue(item, LANGUAGES);

    const updatedItem: Item = {
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

    if (!result) throw new Error('Unable to update description');

    res.status(200).json(getItemDescriptionFields(result.toJSON() as Item));
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
    // @ts-ignore
    item.mainImage = item.images.length > 0 ? getImagePath(item.images[0]) : '';

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

    const files = req.files as MulterFile[];

    try {
      await resizeImages(req, res);
      const newImages = getImages(files);
      const item = await ItemsModel.findOne({ id: req.params.itemId });

      if (!item) {
        throw new Error('Unable to find item by provided itemId');
      }

      item.images = [...(item.images || []), ...newImages];
      // @ts-ignore
      item.mainImage = getImagePath(item.images[0]);

      const updatedItem = await item.save();

      if (!updatedItem) {
        throw new Error('Unable to update item images');
      }

      res.status(200).json(item);

    } catch (err) {
      removeUploadedFiles(files, req.params.itemId, next);
      return next(err);
    }
  });
};

export const addMockedData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (config.env !== 'development') {
      res.status(401).send({ message: `Unauthorized action is ${config.env} environment` });
    } else {
      const data = req.body.data as Item[];
      const items = await ItemsModel.insertMany(data);

      if (!items) {
        throw new Error('Unable to add test data');
      }

      res.status(200).json(items);
    }
  } catch (err) {
    return next(err);
  }
};

export const removeMockedData = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (config.env !== 'development') {
      res.status(401).send({ message: `Unauthorized action is ${config.env} environment` });
    } else {
      await ItemsModel.remove({});
      res.status(200).json(true);
    }
  } catch (err) {
    return next(err);
  }
};
