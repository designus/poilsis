import { Field, Int, ObjectType, ID, Resolver, Query, Arg, buildSchema, FieldResolver, Root } from 'type-graphql';
import { Type, TypesModel } from 'data-models';

@Resolver(of => Type)
export class TypeResolver {

  @Query(returns => [Type])
  async types() {
    return TypesModel.find();
  }

  @Query(returns => Type)
  async type(@Arg('id') id: string) {
    return TypesModel.findOne({ id });
  }
}
