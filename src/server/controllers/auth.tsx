import * as jwt from 'jwt-simple';
import * as passport from 'passport';
import * as moment from 'moment';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersModel as User, IUser } from '../model/users';
// import { voidFn } from '../../client/app/client-utils';

class Auth {

  public initialize = () => {
    passport.use('jwt', this.getStrategy());
    return passport.initialize();
  }

  public authenticate = (callback) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

  private genToken = (user: IUser): object => {
    const expires = moment().utc().add({ days: 7 }).unix();
    const token = jwt.encode({exp: expires, username: user.username, role: user.role}, process.env.JWT_SECRET);

    return {
      token: 'JWT ' + token,
      expires: moment.unix(expires).format(),
      user: user._id,
    };
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

      const success = await user.comparePassword(req.body.password);
      if (success === false) {
        throw new Error('');
      }

      res.status(200).json(this.genToken(user));
    } catch (err) {
      res.status(401).json({ message: 'Invalid credentials', errors: err });
    }
  }

  private getStrategy = (): Strategy => {
    const params = {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      passReqToCallback: true,
    };

    return new Strategy(params, (req, payload: any, done) => {
      console.log('Payload inside strategy', payload);
      User.findOne({username: payload.username }, (err, user) => {
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
