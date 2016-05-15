#!/usr/bin/env node
'use strict';

var exitCode = 0;
const debug = (process.argv.indexOf('--debug') > -1);

// must do this initialization *before* other requires in order to work
if (debug) {
  require('debug').enable('css-ast-diff:*');
}

const cli = require('../lib/cli');

cli.execute(process.argv, function(err, exitCode) {
  if (err) {
    console.error(err);
  }
  process.exit(exitCode);
});
