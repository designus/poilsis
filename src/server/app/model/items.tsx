'use strict';
import { Document, Schema, Model, model } from 'mongoose';

import { RANGE, MAX_PHOTO_COUNT } from 'data-strings';
import {
  IImage,
  IItem,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  itemValidation
} from 'global-utils';

import {
  formatAlias,
  TGenericSchemaMap,
  getValidationMessage,
  requiredMessage
} from '../server-utils';

const shortId = require('shortid');
const mongooseIntl = require('mongoose-intl');

const maxLength = maxLength => value => value.length <= maxLength;
const minLength = minLength => value => value.length >= minLength;
const minMaxLength = (min, max) => value => minLength(min)(value) && maxLength(max)(value);

// @ts-ignore
export interface IItemModel extends IItem, Document {}

const {
  types: { minCheckedCount: minTypesCount, maxCheckedCount: maxTypesCount },
  images: { maxPhotos }
} = itemValidation;

const ImageSchemaMap: TGenericSchemaMap<IImage> = {
  id: {
    type: String,
    sparse: true,
    default: shortId.generate,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  thumbName: {
    type: String,
    required: true
  }
};

const ItemsSchemaMap: TGenericSchemaMap<IItem> = {
  id: {
    type: String,
    unique: true,
    default: shortId.generate,
    required: true
  },
  name: {
    type: String,
    required: [true, requiredMessage],
    intl: true
  },
  cityId: {
    type: String,
    required: [true, requiredMessage]
  },
  address: {
    type: String,
    required: [true, requiredMessage]
  },
  types: {
    type: Array,
    required: [true, requiredMessage],
    validate: [
      minMaxLength(minTypesCount, maxTypesCount),
      getValidationMessage(RANGE, minTypesCount, maxTypesCount)
    ]
  },
  alias: {
    type: String,
    lowercase: true,
    trim: true,
    set: formatAlias,
    intl: true
  },
  userId: {
    type: String,
    required: [true, requiredMessage]
  },
  isEnabled: LANGUAGES.reduce((acc, lang) => {
    acc[lang] = Boolean;
    return acc;
  }, {}),
  isRecommended: Boolean,
  createdAt: Date,
  updatedAt: Date,
  images: {
    type: [ImageSchemaMap],
    validate: [
      maxLength(maxPhotos),
      getValidationMessage(MAX_PHOTO_COUNT, maxPhotos)
    ]
  },
  description: {
    type: String,
    intl: true
  },
  metaTitle: {
    type: String,
    intl: true
  },
  metaDescription: {
    type: String,
    intl: true
  },
  metaKeywords: {
    type: String,
    intl: true
  }
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

export const ItemsModel: Model<IItemModel> = model<IItemModel>('Items', ItemsSchema);
