import { ItemsModel } from '../model';
import { Request, Response, NextFunction } from 'express';
import { IItem, itemValidation, getItemDescriptionFields } from 'global-utils';
import {
  uploadImages,
  resizeImages,
  getImages,
  sendResponse,
  formatAlias,
  getAlias
} from '../server-utils';

const { images: { maxPhotos } } = itemValidation;

const shortId = require('shortid');

export const getAllItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.find(sendResponse(res, next));
};

export const getCityItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel
    .aggregate([
      { $match: { cityId: req.params.cityId } },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          alias: 1,
          types: 1,
          address: 1,
          userId: 1,
          cityId: 1,
          isEnabled: 1,
          mainImage: {
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
          }
        }
      }
    ])
    .exec(sendResponse(res, next));
};

export const getUserItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.find({ userId: req.params.userId }, sendResponse(res, next));
};

export const toggleItemIsEnabledField = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: { isEnabled: req.body.isEnabled } }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const toggleItemIsFavoriteField = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: { isFavorite: req.body.isFavorite } }, { new: true, runValidators: true },
    sendResponse(res, next)
  );
};

export const addNewItem = (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const item: IItem = req.body;
  const alias = getAlias(item);
  const newItem = { id, alias, ...item };

  new ItemsModel(newItem).save(sendResponse(res, next));
};

export const getEditItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({ id: req.params.itemId }, sendResponse(res, next));
};

export const getViewItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({ alias: req.params.alias }, sendResponse(res, next));
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndRemove({id: req.params.itemId}, sendResponse(res, next));
};

export const updateMainInfo = (req: Request, res: Response, next: NextFunction) => {
  const item: IItem = req.body;
  const updatedAt = new Date();
  const alias = formatAlias(item.alias || item.name);
  const updatedItem = { ...item, alias, updatedAt };

  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: updatedItem}, { new: true, runValidators: true },
    sendResponse(res, next)
  );
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
