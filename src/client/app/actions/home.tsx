import { batch } from 'react-redux';
import { showLoader, hideLoader } from 'actions/loader';
import { Item } from 'global-utils/data-models';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNewItems, getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import { HomeActionTypes, ThunkResult } from 'types';
import { handleApiResponse, http } from './utils';
import { receiveItems } from './items';

export const receiveRecommendedItems = (items: string[]) => ({
  type: HomeActionTypes.RECEIVE_RECOMMENDED_ITEMS,
  items
}) as const;

export const loadRecommendedItems = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  dispatch(showLoader(CONTENT_LOADER_ID));
  const state = getState();
  return http.get<Item[]>('/api/items/recommended', setAcceptLanguageHeader(state.locale.client))
    .then(response => handleApiResponse(response))
    .then(items => {
      const newItems = getNewItems(items, getState());
      const data = getNormalizedData(newItems);
      batch(() => {
        dispatch(receiveItems(data.dataMap, data.aliases));
        dispatch(receiveRecommendedItems(items.map(item => item.id)));
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
};
