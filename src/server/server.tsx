import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import StaticRouter from 'react-router-dom/StaticRouter';
import Loadable from 'react-loadable';
import { matchPath, StaticRouter } from 'react-router';
import { getBundles } from 'react-loadable/webpack';
// import { StaticRouter } from 'react-router-dom';
import { matchRoutes, MatchedRoute } from 'react-router-config';
import { JssProvider } from 'react-jss';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { DEFAULT_LANGUAGE, getTranslationMessages } from 'global-utils';
import { IAuthState } from 'reducers';

import app, { staticFilesPort } from './app';
import { config } from '../../config';
import { App, rootReducer, routes } from '../client/app/index';
import { auth, getMaterialUiCSSParams, preloadData } from './app/index';

const stats = require('./stats/reactLoadable.json');

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
      .map((item: MatchedRoute<{}>) => ({fetchData: (item.route.component as any).fetchData, params: item.match.params}))
      .filter(({fetchData}) => Boolean(fetchData))
      .map(({fetchData, params}) => fetchData.bind(null, store, params));

    if (location.includes('admin')) {
      // when we are in admin that requires authentication and we are not logged in, we only preload initial data
      const loadInitialDataOnly = !user;
      return err ? next(err) : preloadData(promises, loadInitialDataOnly).then(() => sendResponse(res, store, location));
    } else {
      return preloadData(promises).then(() => {
        sendResponse(res, store, location);
      });
    }
  })(req, res, next);
});

function sendResponse(res, store, location) {
  const modules: string[] = [];
  const preloadedState = store.getState();
  const sheet: any = new ServerStyleSheet();
  const context = {};
  const styleTags = sheet.getStyleTags();
  const { sheetsRegistry, theme, generateClassName, sheetsManager, materialCSS } = getMaterialUiCSSParams();
  const html = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
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
      </StyleSheetManager>
    </Loadable.Capture>,
  );

  const bundles = getBundles(stats, modules);
  const scripts = bundles
    .filter(bundle => bundle.file.endsWith('.js'))
    .map(script => `<script src="/public/${script.file}"></script>`)
    .join('\n');

  // res.status(200).send(renderFullPage(html, materialCSS, styleTags, finalState));

  res.render('index', {
    locals: {
      html,
      scripts,
      preloadedState,
    },
});
}

// function renderFullPage(html, css1, css2, preloadedState) {
//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Redux Universal Example</title>
//       </head>
//       <body>
//         <div id="app">${html}</div>
//         <style id="jss-server-side">${css1}</style>
//         <style id="styled-css">${css2}</style>
//         <script>
//           window.__INITIAL_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
//         </script>
//         <script src="http://localhost:${staticFilesPort}/public/app.js"></script>
//       </body>
//     </html>
//     `;
// }

Loadable.preloadAll()
  .then(() => {
    app.listen(config.port, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.info(`==> 🌎  Listening on port ${config.port}. Open up http://localhost:${config.port}/ in your browser.`);
      }
    });
  })
  .catch(err => console.log(err));
