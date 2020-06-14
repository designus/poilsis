import { Field, InputType } from 'type-graphql';
import { Image } from 'global-utils/data-models';

@InputType()
export class ImageInput implements Partial<Image> {
  // @Field(type => TranslatableField, { nullable: true })
}
