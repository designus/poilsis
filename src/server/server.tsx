import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchRoutes } from 'react-router-config';
import { JssProvider } from 'react-jss';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { DEFAULT_LANGUAGE, getTranslationMessages } from 'global-utils';
import { IAuthState } from 'reducers';

import app, { staticFilesPort } from './app';
import { config } from '../../config';
import { App, rootReducer, routes } from '../client/app/index';
import { auth, getMaterialUiCSSParams, preloadData } from './app/index';

interface IInitialAuthState {
  auth: IAuthState;
}

const getInitialState = (req, user): IInitialAuthState => {
  if (user) {
    return {
      auth: {
        accessToken: req.cookies.jwt,
        isLoggedIn: true,
        showKeepMeLoggedModal: false,
      },
    };
  }
};

app.get('*', (req, res, next) => {
  return auth.authenticate((err, user, info) => {
    const location = req.url;
    const initialState = getInitialState(req, user);
    const store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
    const branch = matchRoutes(routes, location);
    const promises = branch
      .map(({route, match}) => ({fetchData: (route.component as any).fetchData, params: match.params}))
      .filter(({fetchData}) => Boolean(fetchData))
      .map(({fetchData, params}) => fetchData.bind(null, store, params));

    if (location.includes('admin')) {
      // when we are in admin that requires authentication and we are not logged in, we only preload initial data
      const loadInitialDataOnly = !user;
      return err ? next(err) : preloadData(promises, loadInitialDataOnly).then(() => sendResponse(res, store, location));
    } else {
      return preloadData(promises).then(() => sendResponse(res, store, location));
    }
  })(req, res, next);
});

function sendResponse(res, store, location) {
  const sheet: any = new ServerStyleSheet();
  const context = {};
  const styleTags = sheet.getStyleTags();
  const finalState = store.getState();
  const { sheetsRegistry, theme, generateClassName, sheetsManager, materialCSS } = getMaterialUiCSSParams();
  const responseHtml = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <Provider store={store} key="provider">
            <IntlProvider locale={DEFAULT_LANGUAGE} messages={getTranslationMessages(DEFAULT_LANGUAGE)}>
              <StaticRouter location={location} context={context}>
                <App />
              </StaticRouter>
            </IntlProvider>
          </Provider>
        </MuiThemeProvider>
      </JssProvider>
    </StyleSheetManager>,
  );
  res.status(200).send(renderFullPage(responseHtml, materialCSS, styleTags, finalState));
}

function renderFullPage(html, css1, css2, preloadedState) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app"><div>${html}</div></div>
        <style id="jss-server-side">${css1}</style>
        <style id="styled-css">${css2}</style>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="http://localhost:${staticFilesPort}/public/app.js"></script>
      </body>
    </html>
    `;
}

app.listen(config.port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${config.port}. Open up http://localhost:${config.port}/ in your browser.`);
  }
});
