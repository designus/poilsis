'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypesSchema = new Schema({
	name: String,
	description: String,
	alias: String,
	id: String,
});

export const TypesModel = mongoose.model('Types', TypesSchema);
