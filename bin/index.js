#!/usr/bin/env node
'use strict';

var exitCode = 0;
const debug = (process.argv.indexOf('--debug') > -1);

// must do this initialization *before* other requires in order to work
if (debug) {
  require('debug').enable('css-ast-diff:*');
}

const cli = require('../lib/cli');

exitCode = cli.execute(process.argv);

process.on('exit', function() {
  process.exit(exitCode);
});
