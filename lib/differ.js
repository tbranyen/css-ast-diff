'use strict';

const colors = require('colors');
const jsDiff = require('diff');
const path = require('path');

module.exports = function differ(diff, src) {
  var diffPath = path.relative(process.cwd(), src.file);
  var srcPath = path.relative(process.cwd(), diff.file);

  var patch = jsDiff.createTwoFilesPatch(diffPath, srcPath, src.src, diff.src, src.header, diff.header, {
    context: '4'
  });
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
