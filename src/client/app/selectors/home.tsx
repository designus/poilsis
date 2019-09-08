import { IAppState } from 'types';

export const getRecommendedItems = (state: IAppState) => state.home.recommendedItems;

export const hasRecommendedItemsLoaded = (state: IAppState) => state.home.isLoaded;
