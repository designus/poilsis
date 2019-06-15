const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    pathinfo: false,
    publicPath: 'http://localhost:8080/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
