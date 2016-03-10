'use strict';

// rules like @-moz-document url-prefix()
// merges rules under the document url-prefix query

// @returns Boolean - whether the rule was removed from the rules list

module.exports = function mergeDocument(rule, i, rules, map) {
  var query = rule.vendor + rule.document;

  if (typeof map[query] !== 'undefined') {
    // we've seen this query before -
    // merge the rules under this one with the first instance
    var mergeRule = rules[map[query]];
    mergeRule.rules = mergeRule.rules.concat(rule.rules);

    // remove this rule from the list since we merged it up
    rules.splice(i, 1);
    return true;
  } else {
    // we haven't seen this media query yet - add to the map
    map[query] = i;
    return false;
  }
};
