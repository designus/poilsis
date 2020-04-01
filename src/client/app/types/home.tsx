import { receiveRecommendedItems } from 'actions/home';

export interface IHomeState {
  isLoaded: boolean;
  recommendedItems: string[];
}

export enum HomeActionTypes {
  RECEIVE_RECOMMENDED_ITEMS = 'RECEIVE_RECOMMENDED_ITEMS'
}

export type HomeActions = ReturnType<typeof receiveRecommendedItems>;
