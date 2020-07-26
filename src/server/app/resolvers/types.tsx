import { Mutation, Resolver, Query, Arg, Authorized } from 'type-graphql';
import shortId from 'shortid';
import { Type, TypesModel } from 'global-utils/data-models';
import { UserRoles } from 'global-utils/typings';
import { getAlias } from 'server-utils/aliases';
import { getFormattedIsEnabled } from 'server-utils/methods';
import { TypeInput, EnableInput } from 'global-utils/input-types';

@Resolver(of => Type)
export class TypeResolver {

  async getTypeById(id: string) {
    const type = await TypesModel.findOne({ id });

    if (!type) throw new Error('Unable to find type');

    return type;
  }

  @Query(returns => [Type])
  async types() {
    return TypesModel.find();
  }

  @Query(returns => Type)
  async type(@Arg('id') id: string) {
    return TypesModel.findOne({ id });
  }

  @Mutation(returns => Type)
  @Authorized<UserRoles>([UserRoles.admin])
  async createType(@Arg('type') type: TypeInput): Promise<Type> {
    const id = shortId.generate();
    const isEnabled = getFormattedIsEnabled(type);
    const alias = await getAlias(id, type, TypesModel);

    if (!alias) throw new Error('Unable to create type');

    const newType = {
      id,
      isEnabled,
      alias,
      ...type
    };

    return new TypesModel(newType).save();
  }

  @Mutation(returns => Type)
  @Authorized<UserRoles>([UserRoles.admin])
  async updateType(@Arg('id') id: string, @Arg('type') type: TypeInput): Promise<Type> {
    const isEnabled = getFormattedIsEnabled(type);
    const alias = await getAlias(id, type, TypesModel);

    if (!alias) throw new Error('Unable to update type');

    const typeCandidate = {
      ...type,
      alias,
      isEnabled
    };

    const updatedType = await TypesModel.findOneAndUpdate({ id },  { $set: typeCandidate }, { new: true, runValidators: true });

    if (!updatedType) throw new Error('Type not found');

    return updatedType;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async deleteType(@Arg('id') id: string): Promise<boolean | null> {
    const type = await this.getTypeById(id);

    await type.remove();

    return true;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async enableType(@Arg('params') params: EnableInput) {
    const type = await this.getTypeById(params.id);

    type.isEnabled[params.locale] = params.isEnabled;

    await type.save();

    return true;
  }

}
