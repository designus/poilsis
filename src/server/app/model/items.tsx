'use strict';

import { IMAGES_KEY } from 'data-strings';
import {
  IImage,
  maxFileCount,
  MAX_FILE_COUNT,
  REQUIRED_MESSAGE,
  IItemFields,
  LANGUAGES,
  DEFAULT_LANGUAGE,
} from 'global-utils';
import { formatAlias, TGenericSchemaMap } from '../server-utils';

interface IItemsSchema extends TGenericSchemaMap<IItemFields> {}

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');
const mongooseIntl = require('mongoose-intl');

const arrayLimit = (val) => val.length <= MAX_FILE_COUNT;

const ImageSchemaMap: TGenericSchemaMap<IImage> = {
  id: {
    type: String,
    unique: true,
    default: shortId.generate,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  thumbName: {
    type: String,
    required: true,
  },
};

const ItemsSchemaMap: IItemsSchema = {
  id: {
    type: String,
    unique: true,
    default: shortId.generate,
    required: true,
  },
  name: {
    type: String,
    minLength: 6,
    required: [true, REQUIRED_MESSAGE],
    intl: true,
  },
  cityId: {
    type: String,
    required: [true, REQUIRED_MESSAGE],
  },
  address: {
    type: String,
    required: [true, REQUIRED_MESSAGE],
  },
  types: {
    type: Array,
    required: [true, 'At least one type must be selected'],
  },
  alias: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    set: formatAlias,
    intl: true,
  },
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    intl: true,
  },
  isEnabled: Boolean,
  createdAt: Date,
  updatedAt: Date,
  images: {
    type: [ImageSchemaMap],
    validate: [arrayLimit, maxFileCount(MAX_FILE_COUNT)(IMAGES_KEY)],
  },
};

const ItemsSchema = new Schema(ItemsSchemaMap);

ItemsSchema.plugin(mongooseIntl, { languages: LANGUAGES, defaultLanguage: DEFAULT_LANGUAGE });

ItemsSchema.pre('save', function(next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

export const ItemsModel = mongoose.model('Items', ItemsSchema);
