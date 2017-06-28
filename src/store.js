import { createStore, applyMiddleware, compose } from 'redux';
// import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import logger from 'redux-logger';

export function configureStore(history, initialState) {

    // let middlewares = [routerMiddleware(history), thunkMiddleware];
    let middlewares = [thunkMiddleware];

    // middlewares.push(logger);

    const store = createStore(rootReducer, initialState, compose(
        applyMiddleware(...middlewares),
    ));


    return store;
}
