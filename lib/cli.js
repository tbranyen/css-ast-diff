'use strict';

const async = require('async');
const colors = require('colors');
const cssAstDiff = require('./css-ast-diff');
const debug = require('debug')('css-ast-diff:cli');
const log = require('./logger');
const options = require('./options');
const path = require('path');
const read = require('./read-async');

module.exports = (function() {
  var cli = {};

  cli.execute = function(args) {
    var currentOptions;
    var files;

    try {
      currentOptions = options.parse(args);
    } catch (err) {
      log.error(err.message);
      return 1;
    }

    files = currentOptions._;

    if (currentOptions.version) {
      // version from package.json
      log.info('v' + require('../package.json').version);
      return 0;
    } else if (currentOptions.help || !files.length) {
      log.info(options.generateHelp());
      return 1;
    } else if (files.length > 2) {
      log.error('Too many arguments.');
      log.info(options.generateHelp());
      return 1;
    }

    files = files.map(function(file) {
      return path.join(process.cwd(), file);
    });

    var src;
    var diff = read(files[0]);
    var vcs = currentOptions.svn ? 'svn' : 'git';

    // don't use VCS for source file, use the provided path instead
    if (files.length === 2) {
      log.info('\nComparing ' + colors.underline(currentOptions._[0]) + ' and ' + colors.underline(currentOptions._[1]) + ':');
      src = read(files[1]);
    } else {
      log.info('\nComparing ' + colors.underline(currentOptions._[0]) + ' to ' + colors.green(vcs) + ' repo:');
      src = require('./vcs-cat')[vcs](files[0]);
    }

    async.parallel(
      [src, diff],
      function(err, results) {
        if (err) {
          log.error(err.message);
          return 1;
        }
        debug(results.length);
        cssAstDiff.apply(null, results);
      }
    );
  };

  return cli;
})();
