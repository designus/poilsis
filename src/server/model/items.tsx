'use strict';

import { isRequired } from '../../app/helpers/validation/errorMessages';
import { NAME_KEY, CITY_KEY, ADDRESS_KEY } from '../../app/data-strings';
import { TGenericSchemaMap } from '../../app/helpers';
import { INewItemFields } from '../../app/containers';

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

const ItemsSchemaMap: IItemsSchemaMap = {
	id: {type: String, unique: true, default: shortId.generate, required: true},
	name: {type: String, minLength: 6, required: [true, isRequired(NAME_KEY)]},
	city: {type: String, required: [true, isRequired(CITY_KEY)] },
	address: {type: String, required: [true, isRequired(ADDRESS_KEY)]},
	types: {type: Array, required: [true, 'At least one type must be sleected']},
	alias: {type: String, lowercase: true, trim: true, required: true, set: formatAlias },
	createdAt: {type: Date },
	updatedAt: {type: Date },
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
