export interface IHomeState {
  isLoaded: boolean;
  recommendedItems: string[];
}

export enum HomeActionTypes {
  RECEIVE_RECOMMENDED_ITEMS = 'RECEIVE_RECOMMENDED_ITEMS'
}

export interface IReceiveRecommendedItems {
  type: HomeActionTypes.RECEIVE_RECOMMENDED_ITEMS;
  items: string[];
}

export type HomeActions = IReceiveRecommendedItems;
