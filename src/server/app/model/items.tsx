'use strict';

import { NAME_KEY, CITY_KEY, ADDRESS_KEY, IMAGES_KEY } from '../../../data-strings';
import { TGenericSchemaMap } from '../../../client/app/client-utils';
// import { INewItemFields } from '../../../client/app/pages';
import { IImage, isRequired, maxFileCount, MAX_FILE_COUNT, REQUIRED_MESSAGE } from '../../../global-utils';

interface IItemFields {
  id?: string;
  address?: string;
  city?: string;
  description?: string;
  name?: string;
  types?: string[];
  images?: IImage[];
  files?: any[];
  userId?: string;
}

interface IItemsSchemaMap extends TGenericSchemaMap<IItemFields> {
  alias: any;
  createdAt: any;
  updatedAt: any;
}

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const formatAlias = (alias) => alias
  .split(/\s+/)
  .join('-')
  .toLowerCase();

const arrayLimit = (val) => val.length <= MAX_FILE_COUNT;

const ImageSchemaMap: TGenericSchemaMap<IImage> = {
  id: {type: String, unique: true, default: shortId.generate, required: true},
  fileName: {type: String, required: true},
  path: {type: String, required: true},
  thumbName: {type: String, required: true},
};

const ItemsSchemaMap: IItemsSchemaMap = {
  id: {type: String, unique: true, default: shortId.generate, required: true},
  name: {type: String, minLength: 6, required: [true, isRequired(NAME_KEY)]},
  city: {type: String, required: [true, isRequired(CITY_KEY)] },
  address: {type: String, required: [true, REQUIRED_MESSAGE]},
  types: {type: Array, required: [true, 'At least one type must be selected']},
  alias: {type: String, lowercase: true, trim: true, required: true, set: formatAlias },
  userId: {type: String, required: true},
  createdAt: {type: Date },
  updatedAt: {type: Date },
  images: {
    type: [ImageSchemaMap],
    validate: [arrayLimit, maxFileCount(MAX_FILE_COUNT)(IMAGES_KEY)],
  },
};

const ItemsSchema = new Schema(ItemsSchemaMap);

ItemsSchema.pre('save', function(next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

export const ItemsModel = mongoose.model('Items', ItemsSchema);
