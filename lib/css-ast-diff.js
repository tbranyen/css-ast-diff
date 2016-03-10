'use strict';

const debug = require('debug')('css-ast-diff:cli');
const differ = require('./differ');
const log = require('./logger');
const parse = require('css').parse;
const sort = require('./sorters/ast');
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

    debug('diffing...');
    log.info(differ(src, diff));
  } catch (err) {
    log.error(err.message);
    return 1;
  }
};
