import { Request, Response, NextFunction } from 'express';
import { ICityFields } from 'global-utils';
import { CitiesModel } from '../model';
import { sendResponse } from '../server-utils';

export const getAllCities = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.find(sendResponse(res, next));
};

export const addNewCity = (req: Request, res: Response, next: NextFunction) => {
  const city: ICityFields = req.body;
  const alias = city.alias || city.name;
  const newCity = { ...city, alias };

  new CitiesModel(newCity).save(sendResponse(res, next));
};

export const updateCity = (req: Request, res: Response, next: NextFunction) => {
  const city: ICityFields = req.body;
  const cityId = req.params.cityId;

  CitiesModel.findOneAndUpdate({ id: cityId },  { $set: city }, { new: true, runValidators: true },
    sendResponse(res, next),
  );
};

export const deleteCity = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.findOneAndRemove({ id: req.params.cityId }, sendResponse(res, next));
};
