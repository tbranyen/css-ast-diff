'use strict';

const fs = require('fs');

module.exports = function(file) {
  return function(callback) {
    fs.readFile(file, 'utf8', function(err, results) {
      // normalize line endings
      results = results.replace(/\r\n/, '\n');
      // remove trailing newline
      results = results.replace(/\n$/, '');

      results = {
        src: results,
        file: file
      };

      callback(err, results);
    });
  };
};
