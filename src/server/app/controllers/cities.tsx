import { Request, Response, NextFunction } from 'express';
import shortId from 'shortid';
import { ICity, LANGUAGES, TranslatableField, ToggleFields, Locale } from 'global-utils';
import { sendResponse, getAdjustedIsEnabledValue, getFieldsToUnset, getFieldsToSet } from 'server-utils/methods';
import { getAdjustedAliasValue, getUniqueAlias, getAliasList } from 'server-utils/aliases';
import { getDataByAlias } from './common';
import { CitiesModel } from '../model';

export const getClientCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.headers['accept-language'] as Locale;

    if (!locale) throw new Error('Locale is not set');

    const toggleFields: ToggleFields<ICity> = ['name', 'alias', 'description', 'metaTitle', 'metaDescription', 'isEnabled'];
    const cities = await CitiesModel.aggregate([
      { $project: { _id: 0, __v: 0 } },
      { $unset: getFieldsToUnset<ICity>(LANGUAGES, locale, toggleFields)},
      { $set: getFieldsToSet<ICity>(locale, toggleFields) }
    ])
    .exec();

    if (!cities) throw new Error('Unable to load cities');

    res.status(200).json(cities);

  } catch (err) {
    return next(err);
  }
};

export const getAdminCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cities = await CitiesModel.aggregate([
      { $project: { _id: 0, __v: 0 } }
    ])
    .exec();

    if (!cities) throw new Error('Unable to load cities');

    res.status(200).json(cities);

  } catch (err) {
    return next(err);
  }
};

export const getCity = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.findOne({ id: req.params.cityId }, sendResponse(res, next));
};

export const addNewCity = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const city: ICity = req.body;
  const alias = getAdjustedAliasValue(city, LANGUAGES, next) as TranslatableField;
  const isEnabled = getAdjustedIsEnabledValue(city);
  const citiesByAlias = await getDataByAlias(CitiesModel, alias);
  const newCity = {
    id,
    ...city,
    alias: getUniqueAlias(citiesByAlias, id, alias),
    isEnabled
  };

  new CitiesModel(newCity).save(sendResponse(res, next));
};

export const updateCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city: ICity = req.body;
    const cityId = req.params.cityId;
    const alias = getAdjustedAliasValue(city, LANGUAGES, next) as TranslatableField;
    const isEnabled = getAdjustedIsEnabledValue(city);
    const citiesByAlias = await getDataByAlias(CitiesModel, alias);

    const updatedCity = {
      ...city,
      alias: getUniqueAlias(citiesByAlias, city.id, alias),
      isEnabled
    };

    const newCity = await CitiesModel.findOneAndUpdate({ id: cityId },  { $set: updatedCity }, { new: true, runValidators: true });

    if (!newCity) {
      throw new Error('Unable to update city');
    }

    res.status(200).json(newCity);
  } catch (err) {
    return next(err);
  }
};

export const deleteCity = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.findOneAndRemove({ id: req.params.cityId }, sendResponse(res, next));
};
