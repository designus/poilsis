'use strict';

import { ITypeFields, REQUIRED_MESSAGE, LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import { model, Schema } from 'mongoose';
import { formatAlias, TGenericSchemaMap } from '../server-utils';

const shortId = require('shortid');
const SchemaClass = require('mongoose').Schema;
const mongooseIntl = require('mongoose-intl');

interface ITypeSchema extends TGenericSchemaMap<ITypeFields> {}

const TypesSchemaMap: ITypeSchema = {
  id: { type: String, unique: true, default: shortId.generate, required: true },
  name: { type: String, required: [true, REQUIRED_MESSAGE], intl: true },
  description: { type: String, intl: true },
  alias: { type: String, lowercase: true, trim: true, required: true, set: formatAlias, intl: true },
};

const TypesSchema: Schema = new SchemaClass(TypesSchemaMap);

TypesSchema.plugin(mongooseIntl, { languages: LANGUAGES, defaultLanguage: DEFAULT_LANGUAGE });

export const TypesModel = model('Types', TypesSchema);
