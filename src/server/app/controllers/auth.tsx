import * as jwt from 'jwt-simple';
import * as passport from 'passport';
import * as day from 'dayjs';
import * as JWT from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';
import { Strategy } from 'passport-jwt';
import { UserRoles, SESSION_DURATION_MINUTES, IAccessTokenClaims, Omit } from 'global-utils';
import { USER_NOT_FOUND, INVALID_CREDENTIALS, AUTHORIZATION_FAILED } from 'data-strings';

import { UsersModel, TokensModel, ItemsModel } from 'data-models';

const randToken = require('rand-token');

type TokenParams = Omit<IAccessTokenClaims, 'exp'>;
class Auth {

  public initialize = () => {
    passport.use('jwt', this.getStrategy());
    return passport.initialize();
  }

  public authenticate = (callback?: any) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

  public authenticatePromise = (req: any, res: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      return passport.authenticate('jwt', { session: false, failWithError: true }, (err: any, user: boolean) => {
        if (err) reject(new Error(err));
        else if (!user) reject(new Error('Not authenticated'));
        resolve(user);
      })(req, res);
    });
  }

  public authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const accessToken = this.getAccessTokenClaims(req);
    const { userRole, userId, userItems } = accessToken;
    const hasAccess = roles.indexOf(userRole) !== -1;
    const isOwner = userRole === UserRoles.admin || userItems.indexOf(req.params.itemId) !== -1;
    if (hasAccess && (isOwner || req.method === 'POST')) {
      req.body.userId = userId;
      req.body.userRole = userRole;
      next();
    } else {
      res.status(401).send(AUTHORIZATION_FAILED);
    }
  }

  private genToken = (params: TokenParams) => {
    const exp = day().add(SESSION_DURATION_MINUTES, 'minute').unix();
    const claims: IAccessTokenClaims = { ...params, exp };
    const token = jwt.encode(claims, process.env.JWT_SECRET as string);

    return token;
  }

  private getUserItems = async (userRole: UserRoles, userId: string) => {
    const itemDocs = userRole !== UserRoles.admin ? await ItemsModel.find({ userId }).exec() : [];
    return itemDocs.length ? itemDocs.map(item => item.id) : [];
  }

  public reauthenticate = async (req: Request, res: Response) => {
    try {

      // TODO: Remove refresh token after session expires
      if (!req.body.refreshToken || !req.body.userId) {
        throw new Error('Missing user id or refresh token');
      }

      const { userId, userRole, userName } = req.body;
      const token = await TokensModel.findOne({userId}).exec();

      if (token === null) {
        throw new Error('Refresh token not found');
      }

      if (token.refreshToken !== req.body.refreshToken) {
        throw new Error('Wrong refresh token');
      }

      const userItems = await this.getUserItems(userRole, userId);
      res.status(200).json({ accessToken: this.genToken({ userId, userRole, userItems, userName}) });
    } catch (err) {
      console.error('Reauthenticate error', err.message);
      res.status(401).json({ message: INVALID_CREDENTIALS });
    }
  }

  public login = async (req: Request, res: Response) => {
    try {

      if (!req.body.username || !req.body.password) {
        throw new Error(INVALID_CREDENTIALS);
      }

      const user = await UsersModel.findOne({ username: req.body.username }).exec();

      if (user === null || !user.id) {
        throw new Error(USER_NOT_FOUND);
      }

      const { id: userId, role, name: userName } = user;
      const userRole = role as UserRoles;
      const success = await user.comparePassword(req.body.password);

      if (success === false) {
        throw new Error(INVALID_CREDENTIALS);
      }

      const tokenItem = await TokensModel.findOneAndUpdate({userId},
        {$set: {userId, refreshToken: randToken.uid(32)}}, {upsert: true, new: true}
      );

      if (!tokenItem) {
        throw new Error('');
      }

      const userItems = await this.getUserItems(userRole, userId);

      // TODO: Add Set-cookie http header
      res.status(200).json({
        accessToken: this.genToken({userId, userRole, userName, userItems}),
        refreshToken: tokenItem.refreshToken
      });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  public logout = async (req: Request, res: Response) => {
    try {
      const token = await TokensModel.findOneAndRemove({ userId: req.params.userId }).exec();

      if (!token) {
        throw new Error('Token not found');
      }

      res.status(200).send({message: ''});
    } catch (err) {
      console.error('Logout error', err.message);
      res.status(401).send({message: ''});
    }
  }

  extractFromCookie(req: Request) {
    return req && req.cookies ? req.cookies.jwt : null;
  }

  getAccessTokenClaims(req: Request): IAccessTokenClaims {
    const accessToken = this.extractFromCookie(req);
    return JWT(accessToken);
  }

  private getStrategy = (): Strategy => {
    const params = {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: this.extractFromCookie,
      passReqToCallback: true
    };

    return new Strategy(params, (req: Request, payload: any, done: any) => {
      UsersModel.findOne({ id: payload.userId }, (err, user) => {
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
