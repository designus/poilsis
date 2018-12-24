'use strict';

import { ITypeFields, LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import { model, Schema } from 'mongoose';
import { formatAlias, TGenericSchemaMap, requiredMessage } from '../server-utils';

const shortId = require('shortid');
const SchemaClass = require('mongoose').Schema;
const mongooseIntl = require('mongoose-intl');

interface ITypeSchema extends TGenericSchemaMap<ITypeFields> {}

const TypesSchemaMap: ITypeSchema = {
  id: {
    type: String,
    unique: true,
    default: shortId.generate,
    required: [true, requiredMessage],
  },
  name: {
    type: String,
    required: [true, requiredMessage],
    intl: true,
  },
  description: {
    type: String,
    intl: true,
  },
  alias: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, requiredMessage],
    set: formatAlias,
  },
};

const TypesSchema: Schema = new SchemaClass(TypesSchemaMap);

TypesSchema.plugin(mongooseIntl, { languages: LANGUAGES, defaultLanguage: DEFAULT_LANGUAGE });

export const TypesModel = model('Types', TypesSchema);
