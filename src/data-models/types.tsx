import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField } from 'global-utils/methods';
import { requiredMessage } from 'global-utils/validationMessages';

import { IsEnabled, TranslatableField, NameField } from './common';

export class Type {
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @prop({ required: [true, requiredMessage] })
  public name!: NameField;

  @prop({ default: getDefaultTranslatableField() })
  public description?: TranslatableField;

  @prop({ required: [true, requiredMessage]})
  public isEnabled!: IsEnabled;

  @prop({ required: [true, requiredMessage] })
  public alias!: TranslatableField;

}

export type TypesModelType = ReturnModelType<typeof Type>;

export const TypesModel = getModelForClass(Type, {
  schemaOptions: { collection: 'types' }
});
