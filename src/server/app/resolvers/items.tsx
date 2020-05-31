import { Resolver, Query, Arg, Authorized, Mutation, Ctx } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import shortId from 'shortid';
import { Item, ItemsModel } from 'data-models';
import { UserRoles } from 'global-utils/typings';
import { MainInfoInput } from 'input-types';
import { getFormattedIsEnabled, hasAdminAproval } from 'server-utils/methods';
import { getAlias } from 'server-utils/aliases';
import { Context } from 'server-utils/types';
import { auth } from '../controllers';

@Resolver(of => Item)
export class ItemResolver {

  @Query(returns => [Item])
  async allItems() {
    return ItemsModel.find();
  }

  @Query(returns => [Item])
  async recommendedItems() {
    return ItemsModel.find({ isRecommended: true });
  }

  @Query(returns => [Item])
  async cityItems(@Arg('cityId') cityId: string) {
    return ItemsModel.find({ cityId });
  }

  @Query(returns => [Item])
  async userItems(@Arg('userId') userId: string) {
    return ItemsModel.find({ userId });
  }

  @Query(returns => Item)
  async item(@Arg('id') id: string) {
    return ItemsModel.findOne({ id });
  }

  async getAdjustedFields(id: string, item: MainInfoInput, ctx: Context) {
    const isEnabled = getFormattedIsEnabled(item);
    const alias = await getAlias(id, item, ItemsModel);
    const isApprovedByAdmin = hasAdminAproval(ctx.req, item);
    return {
      isEnabled,
      alias,
      isApprovedByAdmin
    };
  }

  hasUserAccess(itemDocument: DocumentType<Item>, ctx: Context) {
    const claims = auth.getAccessTokenClaims(ctx.req);

    if (claims.userRole === UserRoles.user) {
      return claims.userId === itemDocument.userId;
    }

    return true;
  }

  // TODO: Do not accept userId which is different from the user creating it
  @Mutation(returns => Item)
  @Authorized<UserRoles>([UserRoles.admin, UserRoles.user])
  async createItem(@Arg('item') item: MainInfoInput, @Ctx() ctx: Context): Promise<Item> {
    const id = shortId.generate();
    const adjustedFields = await this.getAdjustedFields(id, item, ctx);
    const newItem: Partial<Item> = { id, ...item, ...adjustedFields };

    return new ItemsModel(newItem).save();
  }

  // TODO: Add guard to check that user changes item that belongs to him
  @Mutation(returns => Item)
  @Authorized<UserRoles>([UserRoles.admin, UserRoles.user])
  async updateItem(@Arg('item') item: MainInfoInput, @Arg('id') id: string, @Ctx() ctx: Context): Promise<Item> {
    const adjustedFields = await this.getAdjustedFields(id, item, ctx);
    const itemCandidate: Partial<Item> = { ...item, ...adjustedFields };

    const updatedItem = await ItemsModel.findOneAndUpdate(
      { id }, { $set: itemCandidate }, { new: true, runValidators: true }
    );

    if (!updatedItem) throw new Error('Unable to find item');

    return updatedItem;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async recommendItem(@Arg('id') id: string, @Arg('isRecommended') isRecommended: boolean): Promise<boolean> {
    const item = await ItemsModel.findOneAndUpdate(
      { id }, { $set: { isRecommended } }, { new: true, runValidators: true }
    );

    if (!item) throw new Error('Unable to find item');

    return true;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async approveItem(@Arg('id') id: string, @Arg('isApproved') isApprovedByAdmin: boolean): Promise<boolean> {
    const item = await ItemsModel.findOneAndUpdate(
      { id }, { $set: { isApprovedByAdmin } }, { new: true, runValidators: true }
    );

    if (!item) throw new Error('Unable to find item');

    return true;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>()
  async deleteItem(@Arg('id') id: string, @Ctx() ctx: Context): Promise<boolean> {
    const item = await ItemsModel.findOne({ id });

    if (!item) throw new Error('Unable to find item');

    if (!this.hasUserAccess(item, ctx)) throw new Error('You have no access');

    await item.remove();

    return true;
  }
}
