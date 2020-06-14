import { Field, Int, ObjectType, ID } from 'type-graphql';
import { prop, arrayProp, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField } from 'global-utils/methods';
import { IsEnabled, TranslatableField, NameField } from './common';

@ObjectType()
export class City {
  @Field(type => ID)
  @prop({ unique: true, default: shortId.generate, required: true })
  id!: string;

  @Field(type => NameField)
  @prop({ required: true, type: NameField })
  name!: NameField;

  @Field(type => [String])
  @arrayProp({ required: true, items: String })
  types!: string[];

  @Field(type => IsEnabled)
  @prop({ required: true, type: IsEnabled })
  isEnabled!: IsEnabled;

  @Field(type => TranslatableField)
  @prop({ required: true, type: TranslatableField })
  alias!: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  description?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaTitle?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaDescription?: TranslatableField;

  hasItems?: boolean;

  isFullyLoaded?: boolean;
}

export type CitiesModelType = ReturnModelType<typeof City>;

export const CitiesModel = getModelForClass(City, {
  schemaOptions: { collection: 'cities' }
});
