import { Field, InputType } from 'type-graphql';
import { City, NameField, TranslatableField, IsEnabled } from 'data-models';

@InputType()
export class CityInput implements Partial<City> {
  @Field(type => NameField)
  name!: NameField;

  @Field(type => [String])
  types!: string[];

  @Field(type => IsEnabled)
  isEnabled!: IsEnabled;

  @Field(type => TranslatableField, { nullable: true })
  alias?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  description?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  metaTitle?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  metaDescription?: TranslatableField;
}
