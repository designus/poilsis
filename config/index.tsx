'use strict';
const env = process.env.NODE_ENV || 'development';
export const config = require(`./${env}`);
