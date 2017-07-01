//model/comments.js
'use strict';
//import dependency
import mongoose from 'mongoose';
import { isRequired } from '../src/helpers/validation/errorMessages';
import { NAME_KEY, CITY_KEY } from '../src/data-strings';

const Schema = mongoose.Schema;
const shortId = require('shortid');
//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.

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

//export our module to use in server.js
export default mongoose.model('Items', ItemsSchema);