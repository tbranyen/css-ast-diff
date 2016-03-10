'use strict';

// rules like @media only screen and (max-width: 1024px)
// merges rules under the same media query

// @returns Boolean - whether the rule was removed from the rules list

module.exports = function mergeMedia(rule, i, rules, map) {
  // normalize whitespace
  rule.media = rule.media.replace(/(\S):(\S)/g, '$1: $2')
                         .replace(/\s+/g, ' ');
  var query = rule.media;

  if (typeof map[query] !== 'undefined') {
    // we've seen this media query before -
    // merge the rules under this one with the first instance of this media query
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
