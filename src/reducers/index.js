import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect'

import cities from './cities';
import types from './types';
import items from './items';
import {newItem} from './newItem';
import global from './global';

const rootReducer = combineReducers({
    cities,
    types,
    items,
    newItem,
    global,
    routing: routerReducer,
    reduxAsyncConnect
})

export default rootReducer;