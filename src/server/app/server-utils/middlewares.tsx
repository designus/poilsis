import { Request, NextFunction, Response } from 'express';
import { getUploadPath } from './methods';
import { removeDirectory, checkIfDirectoryExists } from './fileSystem';

// TODO: Remove deprecated
export const removeImagesDir = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploadPath = getUploadPath(req.params.itemId, 'items');
    await removeDirectory(uploadPath);
    const exists = await checkIfDirectoryExists(uploadPath);
    if (exists) {
      throw new Error ('Unable to remove image directory');
    } else {
      next();
    }
  } catch (err) {
    return next(err);
  }
};

export const handleItemsErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
};
