const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const server = require('./index.js');

let PORT = process.env.PORT || 8080;
let ENV = process.env.NODE_ENV || 'production';

if (ENV === 'production') {
  console.log('production!!');
  server.use(express.static('dist'));
  server.use(compression());
  server.use(helmet());
}

server.listen(PORT, () => {
  console.log('yay!!');
});
