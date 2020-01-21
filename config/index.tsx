import { IConfig } from '../src/global-utils/typings';

const env = process.env.NODE_ENV || 'development';

export const config = require(`./${env}`).default as IConfig;
