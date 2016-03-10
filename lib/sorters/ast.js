'use strict';

const sortRules = require('./rules');

module.exports = function sortAst(ast) {
  sortRules(ast.stylesheet.rules);
  return ast;
};
