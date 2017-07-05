import thunkMiddleware from 'redux-thunk'
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import routes from './routes';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const rootElement = document.getElementById('app');

const store = createStore(rootReducer, window.__INITIAL_STATE__, applyMiddleware(thunkMiddleware));
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
