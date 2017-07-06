import {RECEIVE_CITIES, SELECT_CITY, ADD_ITEMS_TO_CITY, ADD_ITEM_TO_CITY } from '../actions/cities';
import {uniq} from 'lodash';

const cities = (state = null, action) => {

    switch(action.type) {
        
        case SELECT_CITY: 
            return {...state, selectedId: action.cityId}
        case RECEIVE_CITIES: 
            return {...state, ...action.payload};
        case ADD_ITEMS_TO_CITY:
            let items = state.dataMap[action.cityId].items || [];
            let newItems = uniq([...items, ...action.items]);
            return {
                ...state,
                dataMap: {
                    ...state.dataMap,
                    [action.cityId]: {
                        ...state.dataMap[action.cityId],
                        isItemsLoaded: true,
                        items: [...newItems],

                    }
                }
            }
        case ADD_ITEM_TO_CITY:
            let itemsState = state.dataMap[action.cityId].items || [];
            return {
                ...state,
                dataMap: {
                    ...state.dataMap,
                    [action.cityId]: {
                        ...state.dataMap[action.cityId],
                        items: [
                            ...itemsState, 
                            action.itemId
                        ]
                    }
                }

            }
        default:
            return state;    
    }
}

export default cities;