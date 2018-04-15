import * as jwt from 'jwt-simple';
import * as passport from 'passport';
import * as moment from 'moment';
import { Strategy } from 'passport-jwt';
import { UsersModel as User } from '../model/users';
import { TokensModel } from '../model/tokens';

const randToken = require('rand-token');

class Auth {

  public initialize = () => {
    passport.use('jwt', this.getStrategy());
    return passport.initialize();
  }

  public authenticate = (callback?) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

  private genToken = (userId: string) => {
    const expires = moment().utc().add({ minutes: 5 }).unix();
    const claims = { exp: expires, userId };
    const token = jwt.encode(claims, process.env.JWT_SECRET);

    return token;
  }

  public reauthenticate = async (req, res) => {
    try {
      req.checkBody('refreshToken').notEmpty();
      req.checkBody('userId').notEmpty();

      const errors = req.validationErrors();

      if (errors) {
        throw errors;
      }

      const userId = req.body.userId;
      const token = await TokensModel.findOne({userId}).exec();

      if (token === null) {
        throw new Error('Refresh token not found');
      }

      if (token.refreshToken !== req.body.refreshToken) {
        throw new Error('Wrong refresh token');
      }

      res.status(200).json({accessToken: this.genToken(userId)});
    } catch (err) {
      res.status(401).json({message: 'Invalid credentials', errors: err});
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

      const user = await User.findOne({username: req.body.username }).exec();

      if (user === null) {
        throw new Error('User not found');
      }

      const userId = user._id;
      const success = await user.comparePassword(req.body.password);

      if (success === false) {
        throw new Error('');
      }

      const tokenItem = await TokensModel.findOneAndUpdate({userId}, {refreshToken: randToken.uid(32)}, {upsert: true, new: true});

      if (!tokenItem) {
        throw new Error('Failed to create refresh Token');
      }

      res.status(200).json({accessToken: this.genToken(userId), refreshToken: tokenItem.refreshToken});
    } catch (err) {
      res.status(401).json({message: 'Invalid credentials', errors: err});
    }
  }

  private extractFromCookie(req) {
    return req && req.cookies ? req.cookies.jwt : null;
  }

  private getStrategy = (): Strategy => {
    const params = {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: this.extractFromCookie,
      passReqToCallback: true,
    };

    return new Strategy(params, (req, payload: any, done) => {
      User.findOne({ _id: payload.userId }, (err, user) => {
        if (err) { return done(err); }
        if (user === null) {
          return done(null, false, { message: 'The user in the token was not found' });
        }

        return done(null, { _id: user._id, username: user.username });
      });
    });
  }

}

export default new Auth();
