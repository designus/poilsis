
import { Request, Response, NextFunction } from 'express';
import { UsersModel } from '../model/users';
import { sendResponse } from '../server-utils';

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  UsersModel.find({}, 'id name role', sendResponse(res, next));
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
