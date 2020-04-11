import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { _id: false } })
export class Price {
  @prop({ default: null })
  from!: number | null;

  @prop({ default: null })
  to!: number | null;
}
