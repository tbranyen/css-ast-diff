'use strict';

const colors = require('colors');
const jsDiff = require('diff');
const pad = require('pad');
const uniq = require('uniq');

var buffer = 3;

module.exports = function differ(src, diff) {
  var out = [];

  var diffs = jsDiff.diffLines(src, diff);
  var lineNumber = 0;
  var code = [];
  var blobs = [];

  diffs.forEach(function(part) {
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    var char = part.added ? '+' : part.removed ? '-' : ' ';

    var modified = part.added || part.removed || false;
    var lines = part.value.split(/^/m);
    var blob = [];

    lines.forEach(function(line) {
      code.push({
        modified: modified,
        added: part.added || false,
        removed: part.removed || false,
        color: color,
        line: lineNumber,
        src: char + ' ' + line.replace('\n', '')
      });

      blob.push(lineNumber);
      lineNumber++;
    });

    if (modified) {
      var last = blob.length - 1;
      for (var i = 1; i <= buffer; i++) {
        blob.push(blob[0] - i);
        blob.push(blob[last] + i);
      }

      blobs.push(blob);
    }
  });

  var padNum = (lineNumber + '').length;

  blobs = blobs.reduce(function(a, b) {
    return a.concat(b);
  }, []);

  blobs = uniq(blobs).sort(function(a, b) {
    return a - b;
  });

  var last = 0;
  var offset = 0;
  var bloboffset = 0;
  blobs.forEach(function(lineNumber) {
    if (code[lineNumber]) {
      var line = code[lineNumber];
      if (lineNumber - last.line > 1) {
        out.push('');
      }
      if (last.added && !line.added) {
        offset = offset + bloboffset;
        bloboffset = 0;
      } else if (line.added) {
        bloboffset++;
      }
      out.push(colors[line.color](pad(((line.line - offset + 1) + ''), padNum) + ' ' + line.src));
      last = line;
    }
  });

  if (!out.length) {
    out.push('No differences detected!');
  }

  return out.join('\n');
};
