import { addItemsToCity } from './cities';
import { startRequest, responseSuccess, responseFailure } from './global';
import { getNormalizedData } from '../helpers';

export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';

export const selectItem = (id) => {
    return {
        type: SELECT_ITEM,
        itemId: id
    }
}

export const receiveItems = (dataMap, aliases) => {
    return {
        type: RECEIVE_ITEMS,
        dataMap,
        aliases
    }
}

export const receiveItem = (item) => {
  return {
    type: RECEIVE_ITEM,
    item
  }
}

export const fetchItems = (cityId) => {

  return (dispatch) => {
    
    dispatch(startRequest());
    return fetch(`http://localhost:3000/api/cities/${cityId}`)
        .then(items => items.json())
        .then(items => {

            const {dataMap, aliases} = getNormalizedData(items);

            dispatch(receiveItems(dataMap, aliases));
            dispatch(addItemsToCity(cityId, Object.keys(dataMap)));
            dispatch(responseSuccess());

        })
        .catch(err => {
            console.error(err);
            dispatch(responseFailure(err));
        }) 
  }
}