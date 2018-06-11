import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
// import { routes } from './app/routes';
import { Provider } from 'react-redux';
import { store } from './app/store';
const rootElement = document.getElementById('app');
import { App } from './app/pages';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
        <App />
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
