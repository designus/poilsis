import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { IntlProvider } from 'react-intl';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Loadable from 'react-loadable';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import { StaticRouter } from 'react-router';
import { getBundles } from 'react-loadable/webpack';
import { matchRoutes, MatchedRoute } from 'react-router-config';
import { DEFAULT_LANGUAGE, getTranslationMessages, removeDuplicates, theme } from 'global-utils';
import { IAuthState } from 'reducers';

import app, { staticFilesPort } from './app';
import { config } from '../../config';
import { App, rootReducer, routes } from '../client/app/index';
import { auth, preloadData } from './app/index';

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

const isDevelopment = () => process.env.NODE_ENV === 'development';

app.get('*', (req, res, next) => {
  return auth.authenticate((err, user) => {
    const location = req.url;
    const initialState = getInitialState(req, user);
    const store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
    const branch = matchRoutes(routes, location);

    const promises = branch
      .map((item: MatchedRoute<{}>) => {
        return {fetchData: item.route.fetchData, params: item.match.params};
      })
      .filter(({fetchData}) => Boolean(fetchData))
      .map(({fetchData, params}) => fetchData.bind(null, store, params));

    return preloadData(promises).then(() => sendResponse(res, store, location));
  })(req, res, next);
});

function sendResponse(res, store, location) {
  const modules: string[] = [];
  const state = store.getState();
  const sheets = new ServerStyleSheets();
  const context = {};

  const html = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      {sheets.collect(
        <ThemeProvider theme={theme}>
          <Provider store={store} key="provider">
            <IntlProvider locale={DEFAULT_LANGUAGE} messages={getTranslationMessages(DEFAULT_LANGUAGE)}>
              <StaticRouter location={location} context={context}>
                <App />
              </StaticRouter>
            </IntlProvider>
          </Provider>
        </ThemeProvider>,
      )}
    </Loadable.Capture>,
  );

  const css = sheets.toString();
  const bundles = getBundles(stats, modules);
  const preloadedState = serialize(state, { isJSON: true });

  const scripts = bundles
    .filter(bundle => bundle.file.endsWith('.js'))
    .map(script => script.file)
    .filter(removeDuplicates)
    .map(jsFile => `<script src="${isDevelopment() ? 'http://localhost:8080' : ''}/public/${jsFile}"></script>`)
    .join('\n');

  res.render('index', {
    locals: {
      html,
      scripts,
      css,
      preloadedState,
    },
});
}

Loadable.preloadAll()
  .then(() => {
    app.listen(config.port, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.info(`==> 🌎  Listening on ports ${config.port}. Open up http://localhost:${config.port}/ in your browser.`);
      }
    });
  })
  .catch(err => console.log(err));
