'use strict';

import { ICity, LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import { Document, Schema, Model, model} from 'mongoose';
import shortId from 'shortid';

import { formatAlias, GenericSchemaMap, requiredMessage } from '../server-utils';
import { IsEnabledSchemaMap } from './common';

const mongooseIntl = require('mongoose-intl');

// @ts-ignore
export interface ICityDocument extends ICity, Document {}
export type CityModelType = Model<ICityDocument>;

const schemaMap: GenericSchemaMap<ICity> = {
  id: {
    type: String,
    unique: true,
    default: shortId.generate,
    required: true
  },
  name: {
    type: String,
    required: [true, requiredMessage],
    intl: true
  },
  description: {
    type: String,
    intl: true
  },
  types: {
    type: [String]
  },
  isEnabled: {
    type: IsEnabledSchemaMap
  },
  alias: {
    type: String,
    lowercase: true,
    intl: true,
    trim: true,
    required: [true, requiredMessage],
    set: formatAlias
  }
};

const CitySchema = new Schema(schemaMap);

CitySchema.plugin(mongooseIntl, {
  languages: LANGUAGES,
  defaultLanguage: DEFAULT_LANGUAGE
});

export const CitiesModel: CityModelType = model<ICityDocument>('Cities', CitySchema);
