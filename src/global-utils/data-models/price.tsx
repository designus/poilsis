import { Field, Int, ObjectType, ID, InputType } from 'type-graphql';
import { prop, modelOptions } from '@typegoose/typegoose';

@ObjectType()
@InputType('PriceInput')
@modelOptions({ schemaOptions: { _id: false } })
export class Price {
  @Field(type => Int, { nullable: true })
  @prop({ default: null })
  from!: number | null;

  @Field(type => Int, { nullable: true })
  @prop({ default: null })
  to!: number | null;
}
