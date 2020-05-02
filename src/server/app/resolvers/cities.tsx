import { Field, Int, ObjectType, ID, Resolver, Query, Arg, buildSchema, FieldResolver, Root } from 'type-graphql';
import { City, CitiesModel } from 'data-models';
import { hasLocalizedFields } from 'global-utils/methods';

@Resolver(of => City)
export class CityResolver {

  @Query(returns => [City])
  async cities() {
    return CitiesModel.find();
  }

  @Query(returns => City)
  async city(@Arg('id') id: string) {
    return CitiesModel.findOne({ id });
  }

  // @FieldResolver()
  // name(@Root() city: City) {
  //   return hasLocalizedFields(city.name) ? city.name.lt : city.name;
  // }
}
