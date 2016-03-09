'use strict';

const fs = require('fs');

module.exports = function(path) {
  return function(callback) {
    fs.readFile(path, 'utf8', callback);
  };
};
