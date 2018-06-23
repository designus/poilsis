require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

import * as React from 'react';

import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from '../client/app/reducers';
import { routes } from '../client/app/routes';
import { apiRouter } from './app/controllers';
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchRoutes } from 'react-router-config';
import { JssProvider } from 'react-jss';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { getMaterialUiCSSParams, preloadData } from './app/server-utils';
import { App } from '../client/app/pages';
import auth from './app/controllers/auth';
const app = express();
const expressPort = 3000;
const webpackPort = 8080;
const staticFilesPort = app.get('env') === 'production' ? expressPort : webpackPort;
mongoose.connect('mongodb://localhost:27017/poilsis');
// app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use('/public', express.static('build/client'));
app.use('/images', express.static('static/images'));
app.use('/uploads', express.static('uploads'));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(expressValidator());
app.use(auth.initialize());
app.use('/api', apiRouter());
app.get('/favicon.ico', (req, res) => {
  res.send(204);
});

app.get('*', (req, res, next) => {
  return auth.authenticate((err, user, info) => {
    const location = req.url;
    const initialState = user ? {auth: {accessToken: req.cookies.jwt}} : undefined;
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
            <StaticRouter location={location} context={context}>
              <App />
            </StaticRouter>
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

app.listen(expressPort, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${expressPort}. Open up http://localhost:${expressPort}/ in your browser.`);
  }
});
