import { ItemsModel } from '../model';
import { Request, Response, NextFunction } from 'express';
import {
  uploadImages,
  resizeImages,
  getImages,
  sendResponse,
} from '../server-utils';
import { IItemFields, itemValidation } from 'global-utils';

const { images: { maxPhotos } } = itemValidation;

const shortId = require('shortid');

export const getAllItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.find(sendResponse(res, next));
};

export const getCityItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.find({ cityId: req.params.cityId }, sendResponse(res, next));
};

export const getUserItems = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.find({ userId: req.params.userId }, sendResponse(res, next));
};

export const toggleItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: { isEnabled: req.body.isEnabled } }, { new: true, runValidators: true },
    sendResponse(res, next),
  );
};

export const addNewItem = (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const item: IItemFields = req.body;
  const alias = item.alias || item.name;
  const newItem = { id, alias, ...item };

  new ItemsModel(newItem).save(sendResponse(res, next));
};

export const getItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOne({ id: req.params.itemId }, sendResponse(res, next));
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  ItemsModel.findOneAndRemove({id: req.params.itemId}, sendResponse(res, next));
};

export const updateMainInfo = (req: Request, res: Response, next: NextFunction) => {
  const item: IItemFields = req.body;
  const updatedAt = new Date();
  const alias = item.alias || item.name;
  const updatedItem = { ...item, alias, updatedAt };

  ItemsModel.findOneAndUpdate(
    { id: req.params.itemId }, { $set: updatedItem}, { new: true, runValidators: true },
    sendResponse(res, next),
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
        console.log(err);
      });
  });
};
