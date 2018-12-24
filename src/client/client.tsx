import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { App } from './app/pages';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ConnectedIntlProvider } from 'components';

const rootElement = document.getElementById('app');
export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0,
      },
    },
    MuiSnackbar: {
      root: {
        width: '100%',
      },
    },
    MuiInput: {
      underline: {
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottomWidth: '1px',
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        borderRadius: '0!important',
        boxShadow: 'none',
        width: '100%',
        padding: '10px 20px',
      },
    },
  },
});

render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store} key="provider">
      <ConnectedIntlProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>
  </MuiThemeProvider>,
  rootElement,
);
