'use strict';

// removes comment rules
// @returns Boolean - whether the comment was removed (always true)
module.exports = function mergeComment(rule, i, rules, map) {
  rules.splice(i, 1);
  return true;
};
