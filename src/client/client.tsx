import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { injectGlobal } from 'styled-components';
import { routes } from './app/routes';
import { Provider } from 'react-redux';
import { store } from './app/store';
const rootElement = document.getElementById('app');

import { MuiThemeProvider } from 'material-ui/styles';
import createMuiTheme from 'material-ui/styles/createMuiTheme';

export const theme = createMuiTheme({
  palette: {},
  // userAgent: navigator.userAgent,
});

// const injectTapEventPlugin = require('react-tap-event-plugin');
// injectTapEventPlugin();

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
