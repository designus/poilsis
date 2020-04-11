import { prop, modelOptions } from '@typegoose/typegoose';
import { DEFAULT_LANGUAGE } from 'global-utils';

@modelOptions({ schemaOptions: { _id: false } })
export class IsEnabled {
  @prop({ default: false })
  lt!: boolean;

  @prop({ default: false })
  en!: boolean;

  @prop({ default: false })
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
