import {RECEIVE_TYPES, SELECT_TYPE, REQUEST_TYPES} from '../actions/types';
import {normalizeData} from './helpers';

const types = (state = null, action) => {
    switch(action.type) {
        case RECEIVE_TYPES:
            const {dataMap, aliases} = normalizeData(action.payload);
            return {...state, dataMap, aliases};
            break;
        case SELECT_TYPE: 
            return {...state, selectedId: action.typeId}
            break;
        default:
            return state;
    }
}

export default types; 