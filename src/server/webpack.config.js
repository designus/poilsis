const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
let nodeModules = {};

fs.readdirSync(projectRoot + '/node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server.tsx',
  mode: 'production',
  output: {
    path: path.join(projectRoot, 'build', 'server'),    
    filename: 'app.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app'],
    plugins: [
      new TsConfigPathsPlugin()      
    ]
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
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
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
  target: 'node',
  externals: nodeModules
};