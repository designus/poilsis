'use strict';
import * as mongoose from 'mongoose';

export interface IToken extends mongoose.Document {
  userId: string;
  refreshToken: string;
}

const tokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  }
});

export const TokensModel = mongoose.model<IToken>('Tokens', tokenSchema);
