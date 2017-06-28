var path = require('path');
var webpack = require('webpack');

const config = {
  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules'],
  },

  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/client.js'
  ],

  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve('./build')
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
}

module.exports = config;