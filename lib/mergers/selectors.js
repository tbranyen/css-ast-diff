'use strict';

// separate selectors and merge duplicates

// @returns Boolean - whether the rule was removed from the rules list

module.exports = function mergeSelectors(rule, i, rules, map) {
  // if rule has multiple selectors, pull them out as their own rules
  if (rule.selectors.length > 1) {
    for (var j = 1; j < rule.selectors.length; j++) {
      // add each selector to the rules list
      rules.splice(i + 1, 0, Object.assign({}, rule, {
        selectors: [rule.selectors[j]]
      }));
    }
    rule.selectors = [rule.selectors[0]];
  }

  var selector = rule.selectors[0];

  if (typeof map[rule.selectors[0]] !== 'undefined') {
    // we've seen this selector in this rule before -
    // merge the declarations under this one with the first instance of this selector
    var mergeRule = rules[map[selector]];
    mergeRule.declarations = mergeRule.declarations.concat(rule.declarations);

    // remove this rule from the list since we merged it up
    rules.splice(i, 1);
    return true;
  } else {
    // we haven't seen this media query yet - add to the map
    map[selector] = i;
    return false;
  }
};
