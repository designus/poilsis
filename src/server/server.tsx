
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { ReduxAsyncConnect, loadOnServer } = require('redux-connect');

import * as React from 'react';

import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { rootReducer } from '../client/app/reducers';
import routes from '../client/app/routes';
import { apiRouter } from './controllers';

import { JssProvider, SheetsRegistry } from 'react-jss';
const create = require('jss').create;

import preset from 'jss-preset-default';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

// const favicon = require('serve-favicon');

const app = express();
const port = 3000;

// db config
mongoose.connect('mongodb://localhost:27017/poilsis');

// app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', apiRouter());

app.get('/favicon.ico', (req, res) => {
  res.send(204);
});

app.get('*', (req, res) => {
  const location = req.url;
  const store = createStore(rootReducer, undefined, applyMiddleware(thunkMiddleware));
  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      loadOnServer({ ...renderProps, store })
        .then(() => {
          const sheetsRegistry = new SheetsRegistry();
          const theme = createMuiTheme();
          const jss = create(preset());
          jss.options.createGenerateClassName = createGenerateClassName;

          const sheet: any = new ServerStyleSheet();
          const responseHtml = renderToString(
            <StyleSheetManager sheet={sheet.instance}>
              <JssProvider registry={sheetsRegistry} jss={jss}>
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                  <Provider store={store} key="provider">
                    <ReduxAsyncConnect {...renderProps} />
                  </Provider>
                </MuiThemeProvider>
              </JssProvider>
            </StyleSheetManager>,
          );
          const css = sheetsRegistry.toString();
          const styleTags = sheet.getStyleTags();

          const finalState = store.getState();
          res.status(200).send(renderFullPage(responseHtml, css, styleTags, finalState));
      })
      .catch((err) => console.error(err));

    } else {
      res.status(404).send('Not found');
    }
  });
});

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
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="http://localhost:8080/public/app.js"></script>
      </body>
    </html>
    `;
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
