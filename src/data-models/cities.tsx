import { Field, Int, ObjectType, ID } from 'type-graphql';
import { prop, arrayProp, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField } from 'global-utils/methods';
import { getRequiredMessage } from 'global-utils/validationMessages';
import { IsEnabled, TranslatableField, NameField } from './common';

@ObjectType()
export class City {
  @Field(type => ID)
  @prop({ unique: true, default: shortId.generate, required: true })
  id!: string;

  @Field(type => NameField)
  @prop({ required: [true, getRequiredMessage()], type: NameField })
  name!: NameField | string;

  @Field(type => TranslatableField)
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  description?: TranslatableField | string;

  @Field(type => [String])
  @arrayProp({ required: [true, getRequiredMessage()], items: String })
  types!: string[];

  @Field(type => IsEnabled)
  @prop({ required: [true, getRequiredMessage()], type: IsEnabled })
  isEnabled!: IsEnabled | boolean;

  @Field(type => TranslatableField)
  @prop({ required: [true, getRequiredMessage()], type: TranslatableField })
  alias!: TranslatableField | string;

  @Field(type => TranslatableField)
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaTitle?: TranslatableField | string;

  @Field(type => TranslatableField)
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaDescription?: TranslatableField | string;

  hasItems?: boolean;

  isFullyLoaded?: boolean;
}

export type CitiesModelType = ReturnModelType<typeof City>;

export const CitiesModel = getModelForClass(City, {
  schemaOptions: { collection: 'cities' }
});
