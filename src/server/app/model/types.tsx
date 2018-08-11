'use strict';

import { ITypeFields, REQUIRED_MESSAGE } from 'global-utils';
import { Document, Model, model, Schema } from 'mongoose';
import { formatAlias, TGenericSchemaMap } from '../server-utils';

const shortId = require('shortid');
const SchemaClass = require('mongoose').Schema;

interface ITypeModel extends ITypeFields, Document {}
interface ITypeSchema extends TGenericSchemaMap<ITypeFields> {}

const TypesSchemaMap: ITypeSchema = {
  id: { type: String, unique: true, default: shortId.generate, required: true },
  name: { type: String, required: [true, REQUIRED_MESSAGE]},
  description: String,
  alias: { type: String, lowercase: true, trim: true, required: true, set: formatAlias },
};

const TypesSchema: Schema = new SchemaClass(TypesSchemaMap);

export const TypesModel: Model<ITypeModel> = model<ITypeModel>('Types', TypesSchema);
