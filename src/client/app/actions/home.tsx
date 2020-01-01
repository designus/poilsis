import { startLoading, endLoading } from 'actions/loader';
import { IItem } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { IReceiveRecommendedItems, HomeActionTypes } from 'types';
import { handleApiResponse, http } from './utils';
import { receiveNewItems } from './items';

export const receiveRecommendedItems = (items: string[]): IReceiveRecommendedItems => ({
  type: HomeActionTypes.RECEIVE_RECOMMENDED_ITEMS,
  items
});

export const loadRecommendedItems = () => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get('/api/items/recommended')
    .then(handleApiResponse)
    .then((items: IItem[]) => {
      const recommendedItems = items.map(item => item.id);
      dispatch(receiveNewItems(items));
      dispatch(receiveRecommendedItems(recommendedItems));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
