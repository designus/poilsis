import thunkMiddleware from 'redux-thunk'
import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { selectCityIfValid } from './helpers';
import { ReduxAsyncConnect } from 'redux-connect'
import { configureStore } from './store';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';
import routes from './routes';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// const initialState = window.__PRELOADED_STATE__;
const rootElement = document.getElementById('app');

const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__,
);
// const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

render(
  <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent})}>
    <Provider store={store} key="provider">
      <Router
        history={browserHistory}
        render={connectedCmp}
      >
        {routes}
      </Router>
    </Provider>
  </MuiThemeProvider>,
  rootElement
);
