const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
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
      POST: JSON.stringify('http://localhost:3000')
    })
  ]
};
