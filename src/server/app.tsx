require('dotenv').config();
import * as express from 'express';
import es6Renderer from 'express-es6-template-engine';
import { auth, apiRouter, handleItemsErrors, localizeResponse } from './app/index';
import { config } from '../../config';

const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mung = require('express-mung');

const app = express();

export const staticFilesPort = app.get('env') === 'production' ? config.port : 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.db);

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(helmet());
app.use(cors());
// app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(mung.json(localizeResponse));
app.use('/public', express.static('build/client'));
app.use('/images', express.static('static/images'));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(mongoSanitize());
app.use(expressValidator());
app.use(auth.initialize());
app.use('/api', apiRouter(), handleItemsErrors);
app.get('/favicon.ico', (req, res) => res.status(204));

export default app;
