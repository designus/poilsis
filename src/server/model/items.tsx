'use strict';

import { isRequired } from '../../app/helpers/validation/errorMessages';
import { NAME_KEY, CITY_KEY } from '../../app/data-strings';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const formatAlias = (alias) => alias
  .split(/\s+/)
  .join('-')
  .toLowerCase();

const ItemsSchema = new Schema({
  id: {type: String, unique: true, default: shortId.generate, required: true},
  name: {type: String, minLength: 6, required: [true, isRequired(NAME_KEY)]},
  city: {type: String, required: [true, isRequired(CITY_KEY)] },
  types: {type: Array, required: [true, 'At least one type must be sleected']},
  alias: {type: String, lowercase: true, trim: true, required: true, set: formatAlias },
  createdAt: {type: Date, default: Date.now }
});

export const ItemsModel = mongoose.model('Items', ItemsSchema);