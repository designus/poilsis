import { Field, ObjectType, ID } from 'type-graphql';
import { prop, modelOptions } from '@typegoose/typegoose';
import shortId from 'shortid';

@ObjectType()
@modelOptions({ schemaOptions: { _id: false } })
export class Image {
  @Field(type => ID)
  @prop({ unique: true, default: shortId.generate, required: true })
  public id!: string;

  @Field()
  @prop({ required: true })
  public fileName!: string;

  @Field()
  @prop({ required: true })
  public path!: string;

  @Field()
  @prop({ required: true })
  public thumbName!: string;

  public name!: string;

  public preview!: string;
}
