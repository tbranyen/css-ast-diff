'use strict';

const async = require('async');

const log = require('./logger');
const read = require('./read-async');
const vcsCat = require('./vcs-cat');

const cssAstDiff = require('./css-ast-diff');

module.exports = (function() {
  var api = {};

  api.compareFiles = function(src, diff, callback, options) {
    var readSrc = read(src);
    var readDiff = read(diff);

    this._compare(readSrc, readDiff, callback, options);
  };

  api.compareVCS = function(diff, vcs, callback, options) {
    vcs = vcs.toLowerCase();
    if (vcs !== 'git' && vcs !== 'svn') {
      callback(new Error('Unknown VCS ' + vcs));
    }

    var readSrc = vcsCat[vcs](diff);
    var readDiff = read(diff);

    this._compare(readSrc, readDiff, callback, options);
  };

  api._compare = function(readSrc, readDiff, callback, options) {
    async.parallel(
      [readSrc, readDiff],
      function(err, results) {
        if (err) {
          callback(err);
        }
        results.push(callback, options);
        cssAstDiff.apply(null, results);
      }
    );
  }

  return api;
})();
