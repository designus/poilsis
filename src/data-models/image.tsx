import { prop, modelOptions } from '@typegoose/typegoose';
import shortId from 'shortid';

@modelOptions({ schemaOptions: { _id: false } })
export class Image {
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @prop({ required: true })
  public fileName!: string;

  @prop({ required: true })
  public path!: string;

  @prop({ required: true })
  public thumbName!: string;

  public name!: string;

  public preview!: string;
}
