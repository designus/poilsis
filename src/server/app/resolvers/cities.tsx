import { Field, Authorized, Int, ObjectType, ID, Resolver, Query, Arg, buildSchema, FieldResolver, Root } from 'type-graphql';
import { City, CitiesModel } from 'data-models';
import { UserRoles } from 'global-utils/typings';

@Resolver(of => City)
export class CityResolver {

  @Query(returns => [City])
  async cities() {
    return CitiesModel.find();
  }

  @Authorized<UserRoles>([UserRoles.admin])
  @Query(returns => City)
  async city(@Arg('id') id: string) {
    console.log('Id', id);
    return CitiesModel.findOne({ id });
  }
}
