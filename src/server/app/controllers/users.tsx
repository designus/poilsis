
import { Request, Response, NextFunction } from 'express';
import { getFieldsToUnset, getFieldsToSet } from 'server-utils/methods';
import { IUser, ToggleFields, Languages } from 'global-utils/typings';
import { UsersModel } from '../model/users';
import { LANGUAGES } from 'global-utils';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.headers['accept-language'] as Languages;
    const toggleFields: ToggleFields<IUser> = ['isEnabled'];
    const users = await UsersModel.aggregate([
      { $project: { _id: 0, id: 1, name: 1 } },
      { $unset: getFieldsToUnset(LANGUAGES, locale, toggleFields)},
      { $set: getFieldsToSet(locale, toggleFields)}
    ])
    .exec();

    if (!users) throw new Error('Unable to load users');

    res.status(200).json(users);

  } catch (err) {
    return next(err);
  }
};

// TODO: Remove if unused
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await UsersModel.findOne({id: req.params.userId }).exec();

    if (user === null) {
      throw new Error('User not found');
    }

    const { name, role, id } = user;
    res.status(200).send({name, role, id});
  } catch (err) {
    res.status(401).send({ message: err });
  }
};
