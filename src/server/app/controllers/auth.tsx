import * as jwt from 'jwt-simple';
import * as passport from 'passport';
import * as day from 'dayjs';
import * as JWT from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';
import { Strategy } from 'passport-jwt';
import { UserRoles, IItemFields, SESSION_DURATION_MINUTES } from 'global-utils';

import { UsersModel as User } from '../model/users';
import { TokensModel } from '../model/tokens';
import { ItemsModel } from '../model/items';

const randToken = require('rand-token');

class Auth {

  public initialize = () => {
    passport.use('jwt', this.getStrategy());
    return passport.initialize();
  }

  public authenticate = (callback?) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

  public authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const accessToken: any = this.getAccessTokenClaims(req);
    const { userRole, userId, userItems } = accessToken;
    const hasAccess = roles.indexOf(userRole) !== -1;
    const isOwner = userRole === UserRoles.admin || userItems.indexOf(req.params.itemId) !== -1;
    if (hasAccess && (isOwner || req.method === 'POST')) {
      req.body.userId = userId;
      req.body.userRole = userRole;
      next();
    } else {
      res.status(401).send('You are not authorized');
    }
  }

  private genToken = (userId: string, userRole: string, userItems: string[]) => {
    const expires = day().add(SESSION_DURATION_MINUTES, 'minute').unix();
    const claims = { exp: expires, userId, userRole, userItems };
    const token = jwt.encode(claims, process.env.JWT_SECRET);

    return token;
  }

  private getUserItems = async (userRole: string, userId: string) => {
    const itemDocs = userRole !== UserRoles.admin ? await ItemsModel.find({ userId }).exec() : [];
    return itemDocs.length ? itemDocs.map((item: IItemFields) => item.id) : [];
  }

  public reauthenticate = async (req, res) => {
    try {
      req.checkBody('refreshToken').notEmpty();
      req.checkBody('userId').notEmpty();

      const errors = req.validationErrors();

      if (errors) {
        throw errors;
      }

      const { userId, userRole } = req.body;
      const token = await TokensModel.findOne({userId}).exec();

      if (token === null) {
        throw new Error('Refresh token not found');
      }

      if (token.refreshToken !== req.body.refreshToken) {
        throw new Error('Wrong refresh token');
      }

      const userItems = await this.getUserItems(userRole, userId);

      res.status(200).json({ accessToken: this.genToken(userId, userRole, userItems) });
    } catch (err) {
      res.status(401).json({ message: 'Invalid credentials', errors: err });
    }
  }

  public login = async (req, res) => {
    try {
      req.checkBody('username', 'Invalid username').notEmpty();
      req.checkBody('password', 'Invalid password').notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        throw errors;
      }

      const user = await User.findOne({ username: req.body.username }).exec();

      if (user === null) {
        throw new Error('User not found');
      }

      const userId = user.id;
      const userRole = user.role;
      const success = await user.comparePassword(req.body.password);

      if (success === false) {
        throw new Error('');
      }

      const tokenItem = await TokensModel.findOneAndUpdate({userId},
        {$set: {userId, refreshToken: randToken.uid(32)}}, {upsert: true, new: true},
      );

      if (!tokenItem) {
        throw new Error('Failed to create refresh Token');
      }

      const userItems = await this.getUserItems(userRole, userId);

      // TODO: Add Set-cookie http header
      res.status(200).json({accessToken: this.genToken(userId, userRole, userItems), refreshToken: tokenItem.refreshToken});
    } catch (err) {
      res.status(401).json({message: 'Invalid credentials', errors: err});
    }
  }

  public logout = async (req, res) => {
    try {
      const token = await TokensModel.findOneAndRemove({ userId: req.params.userId }).exec();

      if (!token) {
        throw new Error('Token not found');
      }

      res.status(200).send({message: ''});
    } catch (err) {
      res.status(401).send({message: err});
    }
  }

  private extractFromCookie(req) {
    return req && req.cookies ? req.cookies.jwt : null;
  }

  private getAccessTokenClaims(req) {
    const accessToken = this.extractFromCookie(req);
    return JWT(accessToken);
  }

  private getStrategy = (): Strategy => {
    const params = {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: this.extractFromCookie,
      passReqToCallback: true,
    };

    return new Strategy(params, (req, payload: any, done) => {
      User.findOne({ id: payload.userId }, (err, user) => {
        if (err) { return done(err); }
        if (user === null) {
          return done(null, false, { message: 'The user in the token was not found' });
        }

        return done(null, { id: user.id, username: user.username });
      });
    });
  }

}

export const auth = new Auth();
