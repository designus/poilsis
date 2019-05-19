const devPort = process.env.PORT || 3001;

module.exports = {
  env: 'development',
  db: 'mongodb://localhost:27017/poilsis',
  port: devPort,
  host: `http://localhost:${devPort}`,
};
