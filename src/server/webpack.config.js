var fs = require('fs');
var path = require('path');
var nodeModules = {};
const projectRoot = path.join(__dirname, '..', '..');
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

fs.readdirSync(projectRoot + '/node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server.tsx',
  output: {
    path: path.join(projectRoot, 'build', 'public'),    
    publicPath: '/public/',
    filename: 'server.js',
  },
  watch:true,
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
  target: 'node',
  externals: nodeModules,
};