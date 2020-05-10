import { Resolver, Query, Arg } from 'type-graphql';
import { Item, ItemsModel } from 'data-models';

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
}
