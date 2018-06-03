
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const projectRoot = path.join(__dirname, '..', '..', '..');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app'],
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
    path: path.join(projectRoot, 'build', 'client'),    
    publicPath: '/public/',
    filename: '[name].js',
    pathinfo: true
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {}
          }
        ]
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
    new ManifestPlugin({
      fileName: '../../manifest.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
      }
    })
  ]
};
