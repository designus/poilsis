import { prop, arrayProp, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField, getDefaultPriceField } from 'global-utils/methods';
import { GLOBAL_CURRENCY } from 'global-utils/constants';
import { itemValidation } from 'global-utils/validationRules';
import { requiredMessage, getValidationMessage } from 'global-utils/validationMessages';
import { RANGE, MAX_PHOTO_COUNT } from 'data-strings';

import { IsEnabled, TranslatableField, NameField } from './common';
import { Price } from './price';
import { Image } from './image';

const maxLength = (maxLength: number) => (value: string) => value.length <= maxLength;
const minLength = (minLength: number) => (value: string) => value.length >= minLength;
const minMaxLength = (min: number, max: number) => (value: string) => minLength(min)(value) && maxLength(max)(value);
const {
  types: { minCheckedCount: minTypesCount, maxCheckedCount: maxTypesCount },
  images: { maxPhotos }
} = itemValidation;

export class Item {
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @prop({ required: [true, requiredMessage] })
  public name!: NameField;

  @prop({ required: [true, requiredMessage] })
  public alias!: TranslatableField;

  @prop({ required: [true, requiredMessage] })
  public cityId!: string;

  @prop({ default: getDefaultPriceField() })
  public price!: Price;

  @prop({ default: GLOBAL_CURRENCY })
  public currency!: string;

  @prop({ default: '' })
  public address!: string;

  @arrayProp({ required: [true, requiredMessage], items: String, validate: [
    minMaxLength(minTypesCount, maxTypesCount),
    getValidationMessage(RANGE, minTypesCount, maxTypesCount)
  ] })
  public types!: string[];

  @prop({ required: [true, requiredMessage] })
  public userId!: string;

  @prop({ default: false })
  public isApprovedByAdmin!: boolean;

  @prop({ default: false })
  public isRecommended!: boolean;

  @prop({ default: Date.now() })
  public createdAt!: string;

  @prop({ updatedAt: Date.now() })
  public updatedAt!: string;

  @prop({ default: '' })
  public mainImage!: string;

  @arrayProp({ default: [], items: Image, validate: [
    maxLength(maxPhotos),
    getValidationMessage(MAX_PHOTO_COUNT, maxPhotos)
  ] })
  public images!: Image[];

  @prop({ default: getDefaultTranslatableField() })
  public description?: TranslatableField;

  @prop({ required: [true, requiredMessage]})
  public isEnabled!: IsEnabled;

  @prop({ default: getDefaultTranslatableField() })
  public metaTitle?: TranslatableField;

  @prop({ default: getDefaultTranslatableField() })
  public metaDescription?: TranslatableField;
}

export type ItemsModelType = ReturnModelType<typeof Item>;

export const ItemsModel = getModelForClass(Item, {
  schemaOptions: { collection: 'items' }
});
