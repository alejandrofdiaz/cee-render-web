const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const commonConfig = {
  output: {
    path: path.resolve(process.cwd(), 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new HTMLPlugin({
      template: './src/index.html',
      filename: './index.html',
      hash: true,
      cache: true
    }),
    new webpack.DefinePlugin({
      POST: JSON.stringify('/'),
      NODE_ENV: JSON.stringify('development')
    })
  ]
};

module.exports = {
  entry: {
    main: './src/index.js'
  },
  ...commonConfig
};
