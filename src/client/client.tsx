import axios from 'axios';
import * as React from 'react';
// import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
// import { store } from './app/store';
import { createStore } from './app/store';
import { App } from 'pages';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ConnectedIntlProvider } from 'components';
import { IAppState } from 'reducers';
import { reauthenticateUser } from 'actions';
import { isLoggedIn } from 'selectors';

declare global {
  interface Window {
      main: () => void;
      __PRELOADED_STATE__: IAppState;
  }
}

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

window.main = () => {
  const preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;

  const store = createStore(preloadedState);

  axios.interceptors.response.use((response) => {
    const url = response.config.url;
    if (isLoggedIn(store.getState()) && !url.includes('reauthenticate') && !url.includes('logout')) {
      store.dispatch(reauthenticateUser());
    }
    return response;
  },
  Promise.reject);

  Loadable.preloadReady().then(() => {
      ReactDOM.hydrate(
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
  });
};
