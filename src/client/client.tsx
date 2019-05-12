import axios from 'axios';
import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { App } from 'pages';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ConnectedIntlProvider } from 'components';
import { reauthenticateUser } from 'actions';
import { isLoggedIn } from 'selectors';

axios.interceptors.response.use((response) => {
    if (isLoggedIn(store.getState()) && !response.config.url.includes('reauthenticate')) {
      store.dispatch(reauthenticateUser());
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
  document.getElementById('app'),
);
