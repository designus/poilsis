import { IConfig } from '../src/global-utils/typings';

const test: IConfig = {
  env: 'test',
  db: 'mongodb://localhost:27017/poilsis_test',
  port: process.env.PORT || 5000
};

export default test;
