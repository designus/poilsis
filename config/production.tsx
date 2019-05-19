const prodPort  = process.env.PORT || 3000;
module.exports = {
  env: 'production',
  db: 'mongodb://localhost:27017/poilsis',
  port: prodPort,
  host: `http://localhost:${prodPort}`,
};
