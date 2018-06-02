'use strict';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
const shortId = require('shortid');

export interface IUser extends mongoose.Document {
  name: string;
  username: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
}

const usersSchema = new mongoose.Schema({
  name: String,
  role: String,
  id: {type: String, unique: true, default: shortId.generate, required: true},
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

usersSchema.pre('save', (next) => {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

usersSchema.pre('update', (next) => {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

usersSchema.methods.comparePassword = function(password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, success) => {
      if (err) { return reject(err); };
      return resolve(success);
    });
  });
};

export const UsersModel = mongoose.model<IUser>('Users', usersSchema);
