import { Field, ObjectType, ID } from 'type-graphql';
import { prop, arrayProp, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField, getDefaultPriceField } from 'global-utils/methods';
import { GLOBAL_CURRENCY } from 'global-utils/constants';
import { itemValidation } from 'global-utils/validationRules';
import { getRequiredMessage, getValidationMessage } from 'global-utils/validationMessages';
import { RANGE, MAX_PHOTO_COUNT } from 'data-strings';

import { IsEnabled, TranslatableField, NameField } from './common';
import { Price } from './price';
import { Image } from './image';

const maxLength = (maxLength: number) => (value: any) => value.length <= maxLength;
const minLength = (minLength: number) => (value: any) => value.length >= minLength;
const minMaxLength = (min: number, max: number) => (value: any) => minLength(min)(value) && maxLength(max)(value);
const {
  types: { minCheckedCount: minTypesCount, maxCheckedCount: maxTypesCount },
  images: { maxPhotos }
} = itemValidation;

@ObjectType()
export class Item {
  @Field(type => ID)
  @prop({ unique: true, default: shortId.generate, required: true })
  id!: string;

  @Field(type => NameField)
  @prop({ required: true, type: NameField })
  name!: TranslatableField;

  @Field(type => TranslatableField)
  @prop({ required: true, type: TranslatableField })
  alias!: TranslatableField;

  @Field()
  @prop({ required: true })
  cityId!: string;

  @Field(type => Price, { nullable: true })
  @prop({ default: getDefaultPriceField(), type: Price })
  price!: Price;

  @Field({ nullable: true })
  @prop({ default: GLOBAL_CURRENCY })
  currency!: string;

  @Field()
  @prop({ default: '' })
  address!: string;

  @Field(type => [String])
  @arrayProp({ required: true, items: String, validate: [
    {
      validator: minMaxLength(minTypesCount, maxTypesCount),
      message: getValidationMessage(RANGE, minTypesCount, maxTypesCount)
    }
  ] })
  types!: string[];

  @Field()
  @prop({ required: true })
  userId!: string;

  @Field({ nullable: true })
  @prop({ default: false })
  isApprovedByAdmin!: boolean;

  @Field({ nullable: true })
  @prop({ default: false })
  isRecommended!: boolean;

  @Field({ nullable: true })
  @prop({ default: Date.now() })
  createdAt?: string;

  @Field({ nullable: true })
  @prop({ updatedAt: Date.now() })
  updatedAt?: string;

  @Field({ nullable: true })
  @prop({ default: '' })
  mainImage!: string;

  @Field(type => [Image], { nullable: true })
  @arrayProp({ default: [], items: Image, validate: [
    {
      validator: maxLength(maxPhotos),
      message: getValidationMessage(MAX_PHOTO_COUNT, maxPhotos)
    }
  ] })
  images!: Image[];

  @Field(type => TranslatableField, { nullable: true })
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  description?: TranslatableField;

  @Field(type => IsEnabled)
  @prop({ required: [true, getRequiredMessage()], type: IsEnabled })
  isEnabled!: IsEnabled;

  @Field(type => TranslatableField, { nullable: true })
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaTitle?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaDescription?: TranslatableField;

  isFullyLoaded?: boolean;
}

export type ItemsModelType = ReturnModelType<typeof Item>;

export const ItemsModel = getModelForClass(Item, {
  schemaOptions: { collection: 'items' }
});
