//model/comments.js
'use strict';
//import dependency
import mongoose from 'mongoose';
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
  name: {type: String, required: [true, 'Name is missing']},
  city: {type: String, required: [true, 'City is missing'] },
  types: {type: Array, required: [true, 'At least one type must be sleected']},
  alias: {type: String, lowercase: true, trim: true, required: true, set: formatAlias },
  createdAt: {type: Date, default: Date.now }
});

//export our module to use in server.js
export default mongoose.model('Items', ItemsSchema);