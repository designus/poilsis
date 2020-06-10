import { Field, InputType } from 'type-graphql';
import { Image } from 'data-models';

@InputType()
export class ImageInput implements Partial<Image> {

}
