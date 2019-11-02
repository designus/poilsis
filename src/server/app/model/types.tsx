'use strict';

import { Document, Schema, Model, model} from 'mongoose';
import { IType, LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import shortId from 'shortid';
import { formatAlias, GenericSchemaMap, requiredMessage } from '../server-utils';
import { IsEnabledSchemaMap } from './common';

const mongooseIntl = require('mongoose-intl');

// @ts-ignore
export interface ITypeDocument extends IType, Document {}
export type TypeModelType = Model<ITypeDocument>;

const schemaMap: GenericSchemaMap<IType> = {
  id: {
    type: String,
    unique: true,
    default: shortId.generate,
    required: [true, requiredMessage]
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
  isEnabled: {
    type: IsEnabledSchemaMap
  },
  alias: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, requiredMessage],
    set: formatAlias,
    intl: true
  }
};

const TypesSchema: Schema = new Schema(schemaMap);

TypesSchema.plugin(mongooseIntl, { languages: LANGUAGES, defaultLanguage: DEFAULT_LANGUAGE });

export const TypesModel: TypeModelType = model<ITypeDocument>('Types', TypesSchema);
