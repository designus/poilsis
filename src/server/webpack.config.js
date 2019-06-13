const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const nodeExternals = require("webpack-node-externals");
const projectRoot = path.join(__dirname, '..', '..');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
// let nodeModules = {};

// fs.readdirSync(projectRoot + '/node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = {
  target: 'node',
  // externals: nodeModules,
  // Exclude node_modules from the bundle
  externals: [nodeExternals()],
  // entry: './server.tsx',
  // The main entry point source/server/index.tsx
  entry: ['babel-polyfill', './server.tsx'],
  // mode: 'production',
  output: {
    path: path.join(projectRoot, 'build', 'server'),    
    // filename: 'app.js',
    filename: "[name].js"

  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app'],
    plugins: [
      new TsConfigPathsPlugin(),
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  // module: {
  //   rules: [
  //     {
  //       enforce: 'pre',
  //       test: /\.tsx?$/,
  //       loader: 'tslint-loader'
  //     },
  //     {
  //       test: /\.tsx$/,
  //       loader: 'lodash-ts-imports-loader',
  //       exclude: /node_modules/,
  //       enforce: "pre"
  //     },
  //     {
  //       test: /\.tsx?$/,
  //       use: [
  //         {
  //           loader: 'ts-loader',
  //           options: {
  //             transpileOnly: true,
  //             experimentalWatchApi: true,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       test: /\.jsx$/,
  //       loader: 'babel-loader'
  //     },
  //   ]
  // }
  // Plugins in charge to transform the source code
  // Rules are applied from right to left (ts-loader then babel-loader)
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          // 2. babel-preset-react transform React jsx and babel-preset-env es2015 syntax into code understandable by the browser
          //    dynamic-import-node transpile import() to a deferred require() for node
          //    react-loadable/babel declare wich modules are being loaded
          {
            loader: "babel-loader",
            options: {
                babelrc: false,
                presets: [
                    "react",
                    [
                        "env",
                        {
                            modules: false
                        }
                    ]
                ],
                plugins: ["dynamic-import-node", "react-loadable/babel"]
              }
          },
          // 1. TypeScript type check and emit JavaScript es2015 (TypeScript without types) consumable by Babel
          {
            loader: "ts-loader",
            options: {
              configFile: require.resolve("../../tsconfig.json"),
                // context: __dirname
            }
          }
        ]
      }
    ]
  }
};