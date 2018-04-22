const webpack = require('webpack');
const wpMerge = require('webpack-merge');
const baseConfig = require('./webpack.config');

module.exports = wpMerge(baseConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      POST: JSON.stringify('http://localhost:3000/'),
      NODE_ENV: JSON.stringify('development')
    })
  ]
});
