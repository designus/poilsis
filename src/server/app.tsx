require('dotenv').config();
import { auth, apiRouter, handleItemsErrors } from './app/index';
import { config } from '../../config';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
export const staticFilesPort = app.get('env') === 'production' ? config.port : 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.db);

app.use('/public', express.static('build/client'));
app.use('/images', express.static('static/images'));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(mongoSanitize());
app.use(expressValidator());
app.use(auth.initialize());
app.use('/api', apiRouter(), handleItemsErrors);

export default app;
