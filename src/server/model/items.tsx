'use strict';

import { isRequired, maxItemsLength } from '../../client/app/helpers/validation/errorMessages';
import { NAME_KEY, CITY_KEY, ADDRESS_KEY, IMAGES_KEY } from '../../client/app/data-strings';
import { TGenericSchemaMap, MAX_PHOTOS_LENGTH } from '../../client/app/helpers';
import { INewItemFields } from '../../client/app/pages';
import { IImage } from '../../shared';

interface IItemsSchemaMap extends TGenericSchemaMap<INewItemFields> {
  alias: any;
  createdAt: any;
  updatedAt: any;
  id: any;
}

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const formatAlias = (alias) => alias
  .split(/\s+/)
  .join('-')
  .toLowerCase();

const arrayLimit = (val) => val.length <= MAX_PHOTOS_LENGTH;

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
  address: {type: String, required: [true, isRequired(ADDRESS_KEY)]},
  types: {type: Array, required: [true, 'At least one type must be sleected']},
  alias: {type: String, lowercase: true, trim: true, required: true, set: formatAlias },
  createdAt: {type: Date },
  updatedAt: {type: Date },
  images: {
    type: [ImageSchemaMap],
    validate: [arrayLimit, maxItemsLength(MAX_PHOTOS_LENGTH)(IMAGES_KEY)],
  },
};

const ItemsSchema = new Schema(ItemsSchemaMap);

ItemsSchema.pre('save', function(next) {
  const now = new Date();
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

export const ItemsModel = mongoose.model('Items', ItemsSchema);
