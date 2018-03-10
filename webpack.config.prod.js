const webpack = require('webpack');
const wpMerge = require('webpack-merge');
const baseConfig = require('./webpack.config');

module.exports = wpMerge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      POST: JSON.stringify('http://localhost:3000')
    })
  ]
});
