import * as React from 'react';
import thunkMiddleware from 'redux-thunk';
import { render } from 'react-dom';
// import { Router, browserHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

// import { ReduxAsyncConnect } from 'redux-connect';
// import { ConnectedRouter } from 'react-router-redux';

import { injectGlobal } from 'styled-components';
// import { App } from './app/pages';
import { routes } from './app/routes';
// import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './app/reducers';
// import routes from './app/routes';

import { MuiThemeProvider } from 'material-ui/styles';
// import { theme } from './app/global-styles';
import createMuiTheme from 'material-ui/styles/createMuiTheme';

// const history = createHistory();

export const theme = createMuiTheme({
  palette: {},
  // userAgent: navigator.userAgent,
});

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const rootElement = document.getElementById('app');
const initialState = (window as any).__INITIAL_STATE__ ;

const store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
// const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store} key="provider">
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
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
