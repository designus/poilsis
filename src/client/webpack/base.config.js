
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const { ReactLoadablePlugin } = require("react-loadable/webpack");


const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const projectRoot = path.join(__dirname, '..', '..', '..');

module.exports = {
  // entry: {
  //   app: [
  //     './client.tsx'
  //   ]
  // },
  entry: ['babel-polyfill', './client.tsx'],
  // output: {
  //   path: path.join(projectRoot, 'build', 'client'),    
  //   publicPath: '/public/',
  //   filename: '[name].js',
  // },
  // The main entry point source/client/index.tsx
  // Main entry point plus each dynamic import generate a bundle
  // Ex: import(/* webpackChunkName: "about" */ "../pages/about") generate about.js
  output: {
    path: path.join(projectRoot, 'build', 'client'),
    filename: "[name].js",
    chunkFilename: "[name].js",
    publicPath: "/public/"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app'],
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },
  // module: {
  //   rules: [
  //     {
  //       enforce: 'pre',
  //       test: /\.tsx?$/,
  //       use: [
  //         {
  //           loader: 'tslint-loader',
  //           options: {}
  //         }
  //       ]
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
  //     }
  //   ]
  // },

   // Plugins in charge to transform the source code
    // Rules are applied from right to left (ts-loader then babel-loader)
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            // 2. babel-preset-react transform React jsx and babel-preset-env es2015 syntax into code understandable by the browser
            //    syntax-dynamic-import allow babel to parse dynamic import syntax but not transform it
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
                plugins: ["syntax-dynamic-import", "react-loadable/babel"]
              }
            },
            // 1. TypeScript type check and emit JavaScript es2015 (TypeScript without types) consumable by Babel
            {
              loader: "ts-loader",
              options: {
                configFile: require.resolve("../../../tsconfig.json"),
                // context: __dirname,
                // transpileOnly: true,
                // experimentalWatchApi: true,
              }
            }
          ]
        }
      ]
  },

  // React Loadable generate stats for mapping modules to bundle
  // This file is used on server side rendering to determine which bundle need to be load
  // Webpack build server and client simultaneously so we need to commit reactLodable.json in source
  // this way Webpack will always find the file when the server build append before client

  plugins: [
    new ManifestPlugin({
      fileName: '../../manifest.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
      }
    }),
    new ReactLoadablePlugin({
      filename: path.join(__dirname, "..", "..", "server", "stats", "reactLoadable.json")
    })
  ]
};
