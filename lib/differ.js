'use strict';

const colors = require('colors');
const jsDiff = require('diff');
// const log = require('./logger');

module.exports = function differ(src, diff) {
  var patch = jsDiff.createPatch('file', src, diff, '', '');
  var out = [''];

  patch = patch.split(/\n/);
  patch.forEach(function(line) {
    if (line[0] === '+') {
      out.push(colors.green(line));
    } else if (line[0] === '-') {
      out.push(colors.red(line));
    } else {
      out.push(line);
    }
  });

  return out.join('\n');
};
