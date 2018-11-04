'use strict';

import { ICityFields, REQUIRED_MESSAGE, LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import { model } from 'mongoose';
import { formatAlias, TGenericSchemaMap } from '../server-utils';

const shortId = require('shortid');
const Schema = require('mongoose').Schema;
const mongooseIntl = require('mongoose-intl');

interface ICitySchema extends TGenericSchemaMap<ICityFields> {}

const schemaMap: ICitySchema = {
  id: { type: String, unique: true, default: shortId.generate, required: true },
  name: { type: String, required: [true, REQUIRED_MESSAGE], intl: true },
  description: { type: String, intl: true },
  types: { type: [String] },
  alias: { type: String, lowercase: true, trim: true, required: true, set: formatAlias, intl: true },
};

const CitySchema = new Schema(schemaMap);

CitySchema.plugin(mongooseIntl, { languages: LANGUAGES, defaultLanguage: DEFAULT_LANGUAGE });

export const CitiesModel = model('Cities', CitySchema);
