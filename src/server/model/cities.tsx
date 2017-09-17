'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
  name: String,
  description: String,
  types: Array,
  alias: String,
  id: String,
});

export const CitiesModel = mongoose.model('Cities', CitiesSchema);
