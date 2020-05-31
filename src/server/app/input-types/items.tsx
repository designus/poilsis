import { Field, InputType } from 'type-graphql';
import { Item, NameField, TranslatableField, IsEnabled, Price } from 'data-models';

@InputType()
export class MainInfoInput implements Partial<Item> {
  @Field(type => NameField)
  name!: NameField;

  @Field(type => [String])
  types!: string[];

  @Field()
  cityId!: string;

  @Field()
  address!: string;

  @Field()
  userId!: string;

  @Field(type => IsEnabled)
  isEnabled!: IsEnabled;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  isApprovedByAdmin?: boolean;

  @Field(type => Price, { nullable: true })
  price?: Price;

  @Field(type => TranslatableField, { nullable: true })
  alias?: TranslatableField;
}
