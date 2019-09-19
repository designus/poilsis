import axios from 'axios';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';

import { App } from 'pages';
import { ThemeProvider } from '@material-ui/styles';
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { theme } from 'global-utils/theme';
import { IAppState } from 'types';
import { reauthenticateUser } from 'actions/auth';
import { isLoggedIn } from 'selectors';
import { createStore } from './app/store';

library.add(faUser);

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

  // axios.interceptors.response.use((response) => {
  //   const url = response.config.url;
  //   if (isLoggedIn(store.getState()) && !url.includes('reauthenticate') && !url.includes('logout')) {
  //     store.dispatch(reauthenticateUser());
  //   }
  //   return response;
  // },
  // Promise.reject);

  Loadable.preloadReady().then(() => {
      ReactDOM.hydrate(
        <ThemeProvider theme={theme}>
          <Provider store={store} key="provider">
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </ThemeProvider>,
        document.getElementById('app')
      );
  });
};
