
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
// TODO: find more about this
var ManifestPlugin = require('webpack-manifest-plugin');

const projectRoot = path.join(__dirname, '..', '..');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app', 'app/redux'],
    plugins: [
      new TsConfigPathsPlugin()      
    ]
  },

  entry: {
    app: [
      './client.tsx'
    ]
  },
  
  output: {
    path: path.join(projectRoot, 'build', 'public'),    
    publicPath: '/public/',
    filename: '[name].js',
    pathinfo: true
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader'
      },
      {
        test: /\.tsx$/,
        loader: 'lodash-ts-imports-loader',
        exclude: /node_modules/,
        enforce: "pre"
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  plugins: [
    new CheckerPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        tslint: {
          failOnHint: true
        }
      }
    }),
    new ManifestPlugin({
      fileName: '../../manifest.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

module.exports = config;
