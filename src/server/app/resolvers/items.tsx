import { Resolver, Query, Arg, Authorized, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import shortId from 'shortid';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { config } from 'config';
import { Item, Image, ItemsModel } from 'global-utils/data-models';
import { UserRoles, MAX_PHOTOS } from 'global-utils';
import { isAdmin, indexBy } from 'global-utils/methods';
import { MainInfoInput, DescriptionInput } from 'global-utils/input-types';
import {
  getFormattedIsEnabled,
  hasAdminAproval,
  getAlias,
  Context,
  getImagePath
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

  @Mutation(returns => Item)
  @Authorized<UserRoles>()
  async updateItem(@Arg('item') item: MainInfoInput, @Arg('id') id: string, @Ctx() ctx: Context) {
    const existingItem = await this.getOwnItemById(id, ctx);
    const adjustedFields = await this.getAdjustedFields(id, item, ctx);
    const itemCandidate: Partial<Item> = { ...item, ...adjustedFields };

    Object.assign(existingItem, itemCandidate);

    await existingItem.save();

    return existingItem;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async recommendItem(@Arg('id') id: string, @Arg('isRecommended') isRecommended: boolean, @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    item.isRecommended = isRecommended;

    await item.save();

    return true;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async approveItem(@Arg('id') id: string, @Arg('isApprovedByAdmin') isApprovedByAdmin: boolean, @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    item.isApprovedByAdmin = isApprovedByAdmin;

    await item.save();

    return true;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>()
  async removeItem(@Arg('id') id: string, @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    await this.fileUploadService.removeDirectory('items', item.id);

    await item.remove();

    return true;
  }

  @Mutation(returns => Item)
  @Authorized<UserRoles>()
  async updateDescription(@Arg('id') id: string, @Arg('description') description: DescriptionInput, @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    Object.assign(item, description);

    await item.save();

    return item;
  }

  @Mutation(returns => Item)
  @Authorized<UserRoles>()
  async uploadImages(@Arg('files', () => [GraphQLUpload]) files: Array<Promise<FileUpload>>, @Arg('id') id: string, @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    if (item.images.length + files.length > MAX_PHOTOS) {
      throw new Error(`You are not allowed to have more than ${MAX_PHOTOS} uploaded`);
    }

    const resolvedFiles = await Promise.all(files);
    const uploadedImages = await this.fileUploadService.uploadFiles(resolvedFiles, 'items', item.id);
    const existingImages = indexBy<Image>(item.images, 'fileName');
    const newImages = uploadedImages.filter(image => !existingImages[image.fileName]);

    item.images.push(...newImages);
    item.mainImage = getImagePath(item.images[0]);

    await item.save();

    return item;
  }

  @Mutation(returns => Item)
  @Authorized<UserRoles>()
  async updateImages(@Arg('id') id: string, @Arg('images', type => [Image]) images: Image[], @Ctx() ctx: Context) {
    const item = await this.getOwnItemById(id, ctx);

    const updatedFiles = images.map(image => image.fileName);
    await this.fileUploadService.removeFiles(updatedFiles, 'items', id);

    item.images = images;
    item.mainImage = item.images.length ? getImagePath(item.images[0]) : '';

    await item.save();

    return item;
  }

  @Mutation(returns => [Item])
  @Authorized<UserRoles>([UserRoles.admin])
  async addMockedData(@Arg('data', type => [Item]) data: Item[]) {

    if (config.env !== 'development') {
      throw new Error(`Unauthorized action is ${config.env} environment`);
    }

    const items = await ItemsModel.insertMany(data);

    return items;
  }

  @Mutation(returns => Boolean)
  @Authorized<UserRoles>([UserRoles.admin])
  async removeMockedData() {

    if (config.env !== 'development') {
      throw new Error(`Unauthorized action is ${config.env} environment`);
    }

    await ItemsModel.remove({});

    return true;
  }
}
