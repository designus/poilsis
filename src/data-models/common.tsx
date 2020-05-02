import { Field, Int, ObjectType, ID } from 'type-graphql';
import { prop, modelOptions } from '@typegoose/typegoose';
import { DEFAULT_LANGUAGE } from 'global-utils/constants';

@ObjectType()
@modelOptions({ schemaOptions: { _id: false } })
export class IsEnabled {
  @Field()
  @prop({ default: false })
  lt!: boolean;

  @Field()
  @prop({ default: false })
  en!: boolean;

  @Field()
  @prop({ default: false })
  ru!: boolean;
}

@ObjectType()
@modelOptions({ schemaOptions: { _id: false } })
export class TranslatableField {
  @Field()
  @prop({ default: ''})
  lt!: string;

  @Field()
  @prop({ default: '' })
  en!: string;

  @Field()
  @prop({ default: '' })
  ru!: string;
}

@ObjectType()
export class NameField extends TranslatableField {
  @Field()
  @prop({ required: true })
  // @ts-ignore
  [DEFAULT_LANGUAGE]: string;
}
