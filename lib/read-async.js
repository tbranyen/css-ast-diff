'use strict';

const fs = require('fs');

module.exports = function(file) {
  return function(callback) {
    fs.readFile(file, 'utf8', function(err, results) {
      results = {
        src: results,
        file: file
      };
      callback(err, results);
    });
  };
};
