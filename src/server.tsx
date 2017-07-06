import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');

const { ReduxAsyncConnect, loadOnServer } = require('redux-connect');

import * as React from 'react';

import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux';
import { match } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'  

import {CitiesModel, TypesModel, ItemsModel } from './server/model';

import rootReducer from './app/reducers';
import routes from './app/routes';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const favicon = require('serve-favicon');

const app = express();
const router = express.Router();
const port = 3000;

//db config
mongoose.connect('mongodb://localhost:27017/poilsis');
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'production') {

	const webpack = require('webpack');
  const webpackConfig = require('../config/webpack/dev');
	const compiler = webpack(webpackConfig);

	app.use(require('webpack-dev-middleware')(compiler, {
		publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
	}))

	app.use(require('webpack-hot-middleware')(compiler));

}

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')));

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
	res.json({message: 'API initialized'});
	// next();
})

router.route('/cities')
	.get((req, res) => {
		CitiesModel.find((err, cities) => {
			if (err) {
				res.send(err);
			}
			res.json(cities)
		})
	})
	

router.route('/types')
	.get((req, res) => {
		TypesModel.find((err, types) => {
			if (err) {
				res.send(err);
			}
			res.json(types)
		})
	})

router.route('/cities/:cityId')
	.get((req, res) => {
		ItemsModel.find({city: req.params.cityId}, (err, items) => {
			if (err) {
				res.send(err);
			}
			res.json(items)
		})
	})

router.route('/items')
	.get((req, res) => {
		ItemsModel.find((err, items) => {
			if (err) {
				res.send(err);
			}
			res.json(items);
		})
	})
	.post((req, res) => {

		const name = sanitize(req.body.name);
		const city = sanitize(req.body.city);
		const alias = sanitize(req.body.alias) || name;
		const types = req.body.types;

		const newItem = {name, city, alias, types};

		new ItemsModel(newItem).save((err, item) => {
			if (err) {
				res.send(err)
			}
			res.json(item)
		})
	})

app.use('/api', router);

app.get('/favicon.ico', function(req, res) {
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
					const responseHtml = renderToString(
						<MuiThemeProvider muiTheme={getMuiTheme({userAgent: req.headers['user-agent']})}>
							<Provider store={store} key="provider">
								<ReduxAsyncConnect {...renderProps} />
							</Provider>
						</MuiThemeProvider>
					)
					const finalState = store.getState();
					res.status(200).send(renderFullPage(responseHtml, finalState));
			})
			.catch(err => console.error(err));

		} else {
			res.status(404).send('Not found');
		}
	})
	
})

function renderFullPage(html, preloadedState) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app"><div>${html}</div></div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/public/js/app.js"></script>
      </body>
    </html>
    `;
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
