import axios from 'axios';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { createStore } from './app/store';
import { App } from 'pages';
import { ThemeProvider } from '@material-ui/styles';
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { theme } from 'global-utils';
import { IAppState } from 'reducers';
import { reauthenticateUser } from 'actions';
import { isLoggedIn } from 'selectors';

declare global {
  interface Window {
      main: () => void;
      __PRELOADED_STATE__: IAppState;
  }
}

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
        <ThemeProvider theme={theme}>
          <Provider store={store} key="provider">
            <ConnectedIntlProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ConnectedIntlProvider>
          </Provider>
        </ThemeProvider>,
        document.getElementById('app'),
      );
  });
};
