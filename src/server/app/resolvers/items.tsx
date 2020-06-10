import { Resolver, Query, Arg, Authorized, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import shortId from 'shortid';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { Item, ItemsModel } from 'data-models';
import { UserRoles, MAX_PHOTOS } from 'global-utils';
import { MainInfoInput, DescriptionInput } from 'input-types';
import { isAdmin } from 'global-utils/methods';
import {
  removeImageDirectory,
  getFormattedIsEnabled,
  hasAdminAproval,
  getAlias,
  Context,
  createUploadPath
} from 'server-utils';
import { auth } from '../controllers';
import { FileUploadService } from '../services';

@Resolver(of => Item)
export class ItemResolver {

  constructor(
    private readonly fileUploadService: FileUploadService
  ) {}

  async getAdjustedFields(id: string, item: MainInfoInput, ctx: Context) {
    const claims = auth.getAccessTokenClaims(ctx.req);
    const userId = isAdmin(claims.userRole) ? item.userId : claims.userId;
    const isEnabled = getFormattedIsEnabled(item);
    const alias = await getAlias(id, item, ItemsModel);
    const isApprovedByAdmin = hasAdminAproval(ctx.req, item);
    return {
      isEnabled,
      alias,
      isApprovedByAdmin,
      userId
    };
  }

  async getOwnItemById(id: string, ctx: Context) {
    const item = await ItemsModel.findOne({ id });

    if (!item) throw new Error('Unable to find item');

    if (!this.hasUserAccess(item, ctx)) throw new Error('You have no access');

    return item;
  }

  hasUserAccess(itemDocument: DocumentType<Item>, ctx: Context) {
    const claims = auth.getAccessTokenClaims(ctx.req);

    if (claims.userRole === UserRoles.user) {
      return claims.userId === itemDocument.userId;
    }

    return true;
  }

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
  async adminItem(@Arg('id') id: string) {
    return ItemsModel.findOne({ id });
  }

  @Query(returns => Item)
  async clientItem(@Arg('alias') alias: string, @Arg('locale') locale: string) {
    return ItemsModel.findOne({ [`alias.${locale}`]: alias });
  }

  @Mutation(returns => Item)
  @Authorized<UserRoles>()
  async createItem(@Arg('item') item: MainInfoInput, @Ctx() ctx: Context): Promise<Item> {
    const id = shortId.generate();
    const adjustedFields = await this.getAdjustedFields(id, item, ctx);
    const newItem: Partial<Item> = { id, ...item, ...adjustedFields };

    return new ItemsModel(newItem).save();
  }

  // TODO: Add guard to check that user changes item that belongs to him
  @Mutation(returns => Item)
  @Authorized<UserRoles>()
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
  @UseMiddleware(removeImageDirectory)
  @Authorized<UserRoles>()
  async removeItem(@Arg('id') id: string, @Ctx() ctx: Context) {
    const item = await ItemsModel.findOne({ id });

    if (!item) throw new Error('Unable to find item');

    if (!this.hasUserAccess(item, ctx)) throw new Error('You have no access');

    await item.remove();

    return item.id;
  }

  @Mutation(returns => Item)
  @Authorized<UserRoles>()
  async updateDescription(@Arg('id') id: string, @Arg('description') description: DescriptionInput, @Ctx() ctx: Context): Promise<Item> {
    const item = await this.getOwnItemById(id, ctx);

    Object.assign(item, description);

    await item.save();

    return item;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>()
  async uploadPhotos(@Arg('files', () => [GraphQLUpload]) files: Array<Promise<FileUpload>>, @Arg('id') id: string, @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    if (item.images.length + files.length > MAX_PHOTOS) {
      throw new Error(`You are not allowed to have more than ${MAX_PHOTOS} uploaded`);
    }

    const uploadPath = await createUploadPath(id, 'items');
    const tmpPath = await createUploadPath(id, 'tmp');
    const resolvedFiles = await Promise.all(files);

    const uploadedFiles = await this.fileUploadService.uploadFiles(resolvedFiles, tmpPath, uploadPath);

    return true;
  }
}
