import { Field, Int, ObjectType, ID } from 'type-graphql';
import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField } from 'global-utils/methods';
import { getRequiredMessage } from 'global-utils/validationMessages';

import { TranslatableField, NameField, IsEnabled } from './common';

@ObjectType()
export class Type {
  @Field(type => ID)
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @Field(type => NameField)
  @prop({ required: [true, getRequiredMessage()], type: NameField })
  public name!: TranslatableField;

  @Field(type => TranslatableField)
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  public description?: TranslatableField;

  @Field(type => IsEnabled)
  @prop({ required: [true, getRequiredMessage()], type: IsEnabled })
  public isEnabled!: IsEnabled;

  @Field(type => TranslatableField)
  @prop({ required: [true, getRequiredMessage()], type: TranslatableField })
  public alias!: TranslatableField;

  public isFullyLoaded?: boolean;
}

export type TypesModelType = ReturnModelType<typeof Type>;

export const TypesModel = getModelForClass(Type, {
  schemaOptions: { collection: 'types' }
});
