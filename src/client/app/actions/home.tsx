import { batch } from 'react-redux';
import { startLoading, endLoading } from 'actions/loader';
import { IItem } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNewItems, getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import { IReceiveRecommendedItems, HomeActionTypes, ThunkResult, ActionCreator } from 'types';
import { handleApiResponse, http } from './utils';
import { receiveItems } from './items';

export const receiveRecommendedItems: ActionCreator<IReceiveRecommendedItems> = props => ({
  type: HomeActionTypes.RECEIVE_RECOMMENDED_ITEMS,
  ...props
});

export const loadRecommendedItems = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  const state = getState();
  return http.get<IItem[]>('/api/items/recommended', setAcceptLanguageHeader(state.locale.client))
    .then(response => handleApiResponse(response))
    .then(items => {
      const newItems = getNewItems(items, getState());
      const data = getNormalizedData(newItems);
      batch(() => {
        dispatch(receiveItems(data));
        dispatch(receiveRecommendedItems({ items: Object.keys(data.dataMap) }));
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
