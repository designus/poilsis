import thunkMiddleware from 'redux-thunk';
import * as React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';
import { injectGlobal } from 'styled-components';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './app/reducers';
import routes from './app/routes';

import createMuiTheme from 'material-ui/styles/createMuiTheme';
import { MuiThemeProvider } from 'material-ui/styles';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const rootElement = document.getElementById('app');
const initialState = (window as any).__INITIAL_STATE__ ;

const store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

render(
  <MuiThemeProvider theme={createMuiTheme({userAgent: navigator.userAgent})}>
    <Provider store={store} key="provider">
      <Router
        history={browserHistory}
        render={connectedCmp}
      >
        {routes}
      </Router>
    </Provider>
  </MuiThemeProvider>,
  rootElement,
);

// tslint:disable-next-line
injectGlobal`
  body {
    padding: 0;
    margin: 0;
  }
`;