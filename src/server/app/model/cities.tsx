'use strict';

import { ICityFields, REQUIRED_MESSAGE } from 'global-utils';
import { Document, model, Model } from 'mongoose';
import { formatAlias, TGenericSchemaMap } from '../server-utils';

const shortId = require('shortid');
const SchemaClass = require('mongoose').Schema;

interface ICityModel extends ICityFields, Document {}
interface ICitySchema extends TGenericSchemaMap<ICityFields> {}

const schemaMap: ICitySchema = {
  id: { type: String, unique: true, default: shortId.generate, required: true },
  name: { type: String, required: [true, REQUIRED_MESSAGE] },
  description: String,
  types: { type: [String] },
  alias: { type: String, lowercase: true, trim: true, required: true, set: formatAlias },
};

const CitySchema = new SchemaClass(schemaMap);

export const CitiesModel: Model<ICityModel> = model<ICityModel>('Cities', CitySchema);
