import { prop, pre, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcryptjs';

import { UserRoles } from 'global-utils/typings';
import shortId from 'shortid';

@pre<User>('save', function(this, next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
})
export class User {
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public alias!: string;

  @prop({ required: true, enum: UserRoles })
  public role!: UserRoles;

  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: false })
  public isEnabled!: boolean;

  public comparePassword(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err, success) => {
        if (err) { return reject(err); }
        return resolve(success);
      });
    });
  }
}

export type UsersModelType = ReturnModelType<typeof User>;

export const UsersModel = getModelForClass(User, {
  schemaOptions: { collection: 'users' }
});
