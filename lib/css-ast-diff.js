'use strict';

const debug = require('debug')('css-ast-diff:cli');
const differ = require('./differ.js');
const log = require('./logger.js');
const parse = require('css').parse;
const sort = require('./sort.js');
const stringify = require('css').stringify;

module.exports = function(src, diff) {
  try {
    debug('parsing...');
    src = parse(src);
    diff = parse(diff);

    debug('sorting...');
    src = sort(src);
    diff = sort(diff);

    debug('stringifying...');
    src = stringify(src);
    diff = stringify(diff);

    log.info(differ(src, diff));
  } catch (err) {
    log.error(err.message);
    return 1;
  }
};
