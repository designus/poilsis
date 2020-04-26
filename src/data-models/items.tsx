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

export class Item {
  @prop({ unique: true, default: shortId.generate, required: true })
  id!: string;

  @prop({ required: [true, getRequiredMessage()], type: NameField })
  name!: TranslatableField | string;

  @prop({ required: [true, getRequiredMessage()], type: TranslatableField })
  alias!: TranslatableField | string;

  @prop({ required: [true, getRequiredMessage()] })
  cityId!: string;

  @prop({ default: getDefaultPriceField() })
  price!: Price;

  @prop({ default: GLOBAL_CURRENCY })
  currency!: string;

  @prop({ default: '' })
  address!: string;

  @arrayProp({ required: [true, getRequiredMessage()], items: String, validate: [
    {
      validator: minMaxLength(minTypesCount, maxTypesCount),
      message: getValidationMessage(RANGE, minTypesCount, maxTypesCount)
    }
  ] })
  types!: string[];

  @prop({ required: [true, getRequiredMessage()] })
  userId!: string;

  @prop({ default: false })
  isApprovedByAdmin!: boolean;

  @prop({ default: false })
  isRecommended!: boolean;

  @prop({ default: Date.now() })
  createdAt?: string;

  @prop({ updatedAt: Date.now() })
  updatedAt?: string;

  @prop({ default: '' })
  mainImage!: string;

  @arrayProp({ default: [], items: Image, validate: [
    {
      validator: maxLength(maxPhotos),
      message: getValidationMessage(MAX_PHOTO_COUNT, maxPhotos)
    }
  ] })
  images!: Image[];

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  description?: TranslatableField | string;

  @prop({ required: [true, getRequiredMessage()], type: IsEnabled })
  isEnabled!: IsEnabled | boolean;

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaTitle?: TranslatableField | string;

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaDescription?: TranslatableField | string;

  isFullyLoaded?: boolean;
}

export type ItemsModelType = ReturnModelType<typeof Item>;

export const ItemsModel = getModelForClass(Item, {
  schemaOptions: { collection: 'items' }
});
