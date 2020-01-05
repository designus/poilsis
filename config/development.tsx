import { IConfig } from '../src/global-utils/typings';

const port = process.env.PORT || 3000;

const development: IConfig = {
  env: 'development',
  db: 'mongodb://localhost:27017/poilsis',
  port,
  host: `http://localhost:${port}`
};

export default development;
