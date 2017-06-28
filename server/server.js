/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import Express from 'express'
import mongoose from 'mongoose';

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import { ReduxAsyncConnect, loadOnServer, reducer as reduxAsyncConnect } from 'redux-connect';
import { syncHistoryWithStore } from 'react-router-redux';
import { configureStore } from '../src/store';

import bodyParser from 'body-parser';
const sanitize = require('mongo-sanitize');

import React from 'react'
import { renderToString } from 'react-dom/server'
import {match, RouterContext, createMemoryHistory} from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'  

import CitiesModel from '../model/cities';
import TypesModel from '../model/types';
import ItemsModel from '../model/items';

import rootReducer from '../src/reducers';
import routes from '../src/routes';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const app = new Express();
const router = Express.Router();
const port = 3000;

//db config
mongoose.connect('mongodb://localhost:27017/poilsis');
mongoose.Promise = global.Promise;

// Use this middleware to set up hot module reloading via swebpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath,
	historyApiFallback: true
}))
app.use(webpackHotMiddleware(compiler));

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
	res.json({message: 'API initialized'});
	next();
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

app.get('*', (request, response) => {
	const location = request.url;
  	const memoryHistory = createMemoryHistory(request.originalUrl);
  	const store = configureStore(memoryHistory);
  	const history = syncHistoryWithStore(memoryHistory, store);
	console.log('Inside server', request.url);

	match({history, routes, location}, function(error, redirectLocation, renderProps) {
		if (error) {
			response.status(500).send(error.message);
		} else if (redirectLocation) {
			response.redirect(302, redirectLocation.pathName + redirectLocation.search);
		} else if (renderProps) {

			loadOnServer({ ...renderProps, store }).then(() => {
				const responseHtml = renderToString(
	        <MuiThemeProvider muiTheme={getMuiTheme({userAgent: request.headers['user-agent']})}>
						<Provider store={store} key="provider">
							<ReduxAsyncConnect {...renderProps} />
						</Provider>
					</MuiThemeProvider>
				)

				const finalState = store.getState();
				response.status(200).send(renderFullPage(responseHtml, finalState));

			})					

		} else {
			response.status(404).send('Not found');
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
        <script src="/bundle.js"></script>
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
