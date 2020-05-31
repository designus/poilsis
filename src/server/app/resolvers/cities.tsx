import { Authorized, Mutation, Resolver, Query, Arg } from 'type-graphql';
import shortId from 'shortid';
import { City, CitiesModel } from 'data-models';
import { UserRoles } from 'global-utils/typings';
import { getAlias } from 'server-utils/aliases';
import { getFormattedIsEnabled } from 'server-utils/methods';
import { CityInput } from 'input-types';

@Resolver(of => City)
export class CityResolver {

  @Query(returns => [City])
  async cities() {
    return CitiesModel.find();
  }

  @Query(returns => City)
  async city(@Arg('id') id: string) {
    const city = await CitiesModel.findOne({ id });

    if (!city) throw new Error('City not found');

    return city;
  }

  @Mutation(returns => City)
  @Authorized<UserRoles>([UserRoles.admin])
  async createCity(@Arg('city') city: CityInput): Promise<City> {
    const id = shortId.generate();
    const isEnabled = getFormattedIsEnabled(city);
    const alias = await getAlias(id, city, CitiesModel);

    if (!alias) throw new Error('Unable to create city');

    const newCity = {
      id,
      isEnabled,
      alias,
      ...city
    };

    return new CitiesModel(newCity).save();
  }

  @Mutation(returns => City)
  @Authorized<UserRoles>([UserRoles.admin])
  async updateCity(@Arg('id') id: string, @Arg('city') city: CityInput): Promise<City> {
    const isEnabled = getFormattedIsEnabled(city);
    const alias = await getAlias(id, city, CitiesModel);

    if (!alias) throw new Error('Unable to update city');

    const cityCandidate = {
      ...city,
      alias,
      isEnabled
    };

    const updatedCity = await CitiesModel.findOneAndUpdate({ id },  { $set: cityCandidate }, { new: true, runValidators: true });

    if (!updatedCity) throw new Error('City not found');

    return updatedCity;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async deleteCity(@Arg('id') id: string): Promise<boolean | null> {
    const city = await CitiesModel.findOne({ id });
    if (!city) throw new Error('City not found');
    await city.remove();
    return true;
  }

}
