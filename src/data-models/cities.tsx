import { prop, arrayProp, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import shortId from 'shortid';

import { getDefaultTranslatableField } from 'global-utils/methods';
import { getRequiredMessage } from 'global-utils/validationMessages';
import { IsEnabled, TranslatableField, NameField } from './common';

export class City {
  @prop({ unique: true, default: shortId.generate, required: true })
  id!: string;

  @prop({ required: [true, getRequiredMessage()], type: NameField })
  name!: TranslatableField | string;

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  description?: TranslatableField | string;

  @arrayProp({ required: [true, getRequiredMessage()], items: String })
  types!: string[];

  @prop({ required: [true, getRequiredMessage()], type: IsEnabled })
  isEnabled!: IsEnabled | boolean;

  @prop({ required: [true, getRequiredMessage()], type: TranslatableField })
  alias!: TranslatableField | string;

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaTitle?: TranslatableField | string;

  @prop({ default: getDefaultTranslatableField(), type: TranslatableField })
  metaDescription?: TranslatableField | string;

  hasItems?: boolean;

  isFullyLoaded?: boolean;
}

export type CitiesModelType = ReturnModelType<typeof City>;

export const CitiesModel = getModelForClass(City, {
  schemaOptions: { collection: 'cities' }
});
