//model/comments.js
'use strict';
//import dependency
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
const CitiesSchema = new Schema({
  name: String,
  description: String,
  types: Array,
  alias: String,
  id: String
});

//export our module to use in server.js
export default mongoose.model('Cities', CitiesSchema); 
