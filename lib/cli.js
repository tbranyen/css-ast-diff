'use strict';

const colors = require('colors');
const path = require('path');

const logger = require('./logger');

const options = require('./options');
const api = require('./api');

module.exports = (function() {
  var cli = {};

  cli.execute = function(args, callback) {
    var currentOptions;

    try {
      currentOptions = options.parse(args);
    } catch (err) {
      logger.error(err.message);
      return 1;
    }

    var files = currentOptions._;
    currentOptions.git = !currentOptions.svn;

    if (currentOptions.version) {
      // css-ast-diff -v
      logger.info('v' + require('../package.json').version);
      return 0;
    } else if (currentOptions.help || !files.length) {
      // css-ast-diff --help
      logger.info(options.generateHelp());
      return 1;
    } else if (files.length > 2) {
      logger.error('Too many arguments.');
      logger.info(options.generateHelp());
      return 1;
    }

    var paths = files.map(function(file) {
      return path.join(process.cwd(), file);
    });

    if (files.length === 2) {
      // comparing two paths
      logger.info('\nComparing ' + colors.underline(currentOptions._[0]) + ' and ' + colors.underline(currentOptions._[1]) + ':');
      api.compareFiles(paths[1], paths[0], callback, currentOptions);
    } else {
      // comparing path and SVN or git
      var vcs = currentOptions.svn ? 'svn' : 'git';
      logger.info('\nComparing ' + colors.underline(currentOptions._[0]) + ' to ' + colors.green(vcs) + ' repo:');
      api.compareVCS(paths[0], vcs, callback, currentOptions);
    }
  };

  return cli;
})();
