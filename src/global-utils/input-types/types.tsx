import { Field, InputType } from 'type-graphql';
import { Type, NameField, TranslatableField, IsEnabled } from 'global-utils/data-models';

@InputType()
export class TypeInput implements Partial<Type> {
  @Field(type => NameField)
  name!: NameField;

  @Field(type => IsEnabled)
  isEnabled!: IsEnabled;

  @Field(type => TranslatableField, { nullable: true })
  alias?: TranslatableField;

  @Field(type => TranslatableField, { nullable: true })
  description?: TranslatableField;
}
