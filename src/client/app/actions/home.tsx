import { batch } from 'react-redux';
import { startLoading, endLoading } from 'actions/loader';
import { IItem } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNewItems, getNormalizedData } from 'client-utils/methods';
import { IReceiveRecommendedItems, HomeActionTypes, ThunkResult } from 'types';
import { handleApiResponse, http } from './utils';
import { receiveItems } from './items';

export const receiveRecommendedItems = (items: string[]): IReceiveRecommendedItems => ({
  type: HomeActionTypes.RECEIVE_RECOMMENDED_ITEMS,
  items
});

export const loadRecommendedItems = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return http.get<IItem[]>('/api/items/recommended')
    .then(response => handleApiResponse(response))
    .then(items => {
      const newItems = getNewItems(items, getState());
      const data = getNormalizedData(newItems);
      batch(() => {
        dispatch(receiveItems(data));
        dispatch(receiveRecommendedItems(Object.keys(data.dataMap)));
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
