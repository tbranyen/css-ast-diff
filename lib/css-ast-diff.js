'use strict';

const debug = require('debug')('css-ast-diff:cli');
const differ = require('./differ');
const logger = require('./logger');
const parse = require('css').parse;
const sort = require('./sorters/ast');
const stringify = require('css').stringify;

module.exports = function cssAstDiff(src, diff, callback, options) {
  try {
    debug('parsing...');
    src.ast = parse(src.src);
    diff.ast = parse(diff.src);

    debug('sorting...');
    src.ast = sort(src.ast);
    diff.ast = sort(diff.ast);

    debug('stringifying...');
    src.src = stringify(src.ast);
    diff.src = stringify(diff.ast);

    debug('diffing...');
    logger.info(differ(src, diff));

    callback();
  } catch (err) {
    callback(err);
  }
};
