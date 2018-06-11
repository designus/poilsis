const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    pathinfo: true
  },
  devtool: 'source-map'
});
