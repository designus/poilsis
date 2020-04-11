import { prop, modelOptions } from '@typegoose/typegoose';
import { Locale, DEFAULT_LANGUAGE, LANGUAGES, getDefaultTranslatableField } from 'global-utils';

export const IsEnabledSchemaMap: Record<Locale, any> = {
  lt: Boolean,
  en: Boolean,
  ru: Boolean
};

@modelOptions({ schemaOptions: { _id: false } })
export class IsEnabled {
  @prop({ default: false, required: true })
  lt!: boolean;

  @prop({ default: false, required: true })
  en!: boolean;

  @prop({ default: false, required: true })
  ru!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
export class TranslatableField {
  @prop({ default: ''})
  lt!: string;

  @prop({ default: '' })
  en!: string;

  @prop({ default: '' })
  ru!: string;
}

export class NameField extends TranslatableField {
  @prop({ required: true })
  // @ts-ignore
  [DEFAULT_LANGUAGE]: string;
}

