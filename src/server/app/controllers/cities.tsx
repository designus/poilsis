import { Request, Response, NextFunction } from 'express';
import shortId from 'shortid';
import { ICity, LANGUAGES, TranslatableField } from 'global-utils';
import { sendResponse, getAdjustedIsEnabledValue } from 'server-utils/methods';
import { getAdjustedAliasValue, getItemsByAliasesQuery, getUniqueAlias, getAliasList } from 'server-utils/aliases';
import { CitiesModel } from '../model';

const getCitiesByAlias = async (alias: TranslatableField): Promise<ICity[]> => {
  const aliasValues = Object.values(alias).filter(Boolean);
  const documents = await CitiesModel.find(getItemsByAliasesQuery(aliasValues));
  return documents.map(item => (item.toJSON() as ICity));
};

export const getAllCities = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.find(sendResponse(res, next));
};

export const getCity = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.findOne({ id: req.params.cityId }, sendResponse(res, next));
};

export const addNewCity = async (req: Request, res: Response, next: NextFunction) => {
  const id = shortId.generate();
  const city: ICity = req.body;
  const alias = getAdjustedAliasValue(city, LANGUAGES) as TranslatableField;
  const isEnabled = getAdjustedIsEnabledValue(city);
  const newCity = {
    id,
    ...city,
    alias: getUniqueAlias(await getCitiesByAlias(alias), id, alias),
    isEnabled
  };

  new CitiesModel(newCity).save(sendResponse(res, next));
};

export const updateCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city: ICity = req.body;
    const cityId = req.params.cityId;
    const alias = getAdjustedAliasValue(city, LANGUAGES) as TranslatableField;
    const isEnabled = getAdjustedIsEnabledValue(city);

    const updatedCity = {
      ...city,
      alias: getUniqueAlias(await getCitiesByAlias(alias), city.id, alias),
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

export const doesCityAliasExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city: ICity = req.body;
    const alias = getAdjustedAliasValue(city, LANGUAGES, next) as TranslatableField;
    const citiesByAlias = await getCitiesByAlias(alias);
    const existingAliases = getAliasList(citiesByAlias, city.id);
    res.status(200).json(existingAliases.length > 0);
  } catch (err) {
    return next(err);
  }
};

export const deleteCity = (req: Request, res: Response, next: NextFunction) => {
  CitiesModel.findOneAndRemove({ id: req.params.cityId }, sendResponse(res, next));
};
