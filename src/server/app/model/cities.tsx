import { prop, arrayProp, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';

import { getDefaultTranslatableField } from 'global-utils/methods';
import shortId from 'shortid';

import { requiredMessage } from '../server-utils';
import { IsEnabled, TranslatableField, NameField } from './common';

export class City {
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @prop({ required: [true, requiredMessage] })
  public name!: NameField;

  @prop({ default: getDefaultTranslatableField() })
  public description?: TranslatableField;

  @arrayProp({ required: [true, requiredMessage], items: String })
  public types!: string[];

  @prop({ required: [true, requiredMessage]})
  public isEnabled!: IsEnabled;

  @prop({ required: [true, requiredMessage] })
  public alias!: TranslatableField;

  @prop({ default: getDefaultTranslatableField() })
  public metaTitle?: TranslatableField;

  @prop({ default: getDefaultTranslatableField() })
  public metaDescription?: TranslatableField;
}

export type CitiesModelType = ReturnModelType<typeof City>;

export const CitiesModel = getModelForClass(City, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'cities' }
});
