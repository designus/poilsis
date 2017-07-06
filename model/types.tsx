'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
const TypesSchema = new Schema({
  name: String,
  description: String,
  alias: String,
  id: String
});

//export our module to use in server.js
export default mongoose.model('Types', TypesSchema);