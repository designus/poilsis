import { Field, InputType } from 'type-graphql';
import { Locale } from 'global-utils/typings';

@InputType()
export class EnableItemInput {
  @Field()
  id!: string;

  @Field()
  locale!: Locale;

  @Field()
  isEnabled!: boolean;
}
