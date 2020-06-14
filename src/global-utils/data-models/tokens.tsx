import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';

export class Token {
  @prop({ unique: true, required: true })
  public userId!: string;

  @prop({ required: true })
  public refreshToken!: string;

}

export type TokensModelType = ReturnModelType<typeof Token>;

export const TokensModel = getModelForClass(Token, {
  schemaOptions: { collection: 'tokens' }
});
