import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField } from 'global-utils/methods';
import { getRequiredMessage } from 'global-utils/validationMessages';

import { TranslatableField, NameField, IsEnabled } from './common';

export class Type {
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @prop({ required: [true, getRequiredMessage()], type: NameField })
  public name!: TranslatableField | string;

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  public description?: TranslatableField | string;

  @prop({ required: [true, getRequiredMessage()], type: IsEnabled })
  public isEnabled!: IsEnabled | boolean;

  @prop({ required: [true, getRequiredMessage()], type: TranslatableField })
  public alias!: TranslatableField | string;

  public isFullyLoaded?: boolean;
}

export type TypesModelType = ReturnModelType<typeof Type>;

export const TypesModel = getModelForClass(Type, {
  schemaOptions: { collection: 'types' }
});
