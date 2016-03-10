'use strict';

// TODO: add/test support for other at-rules
//       https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
module.exports = function mergeRules(rules) {
  var mergerList = ['comment', 'document', 'media', 'selectors'];
  var mergers = {};

  var rule;

  mergerList.forEach(function(merger) {
    mergers[merger] = {};
    mergers[merger].merger = require('./' + merger);
    mergers[merger].map = {};
  });

  for (var i = 0; i < rules.length; i++) {
    rule = rules[i];

    mergerList.forEach(function(merger) {
      // if rule is of type merger, e.g. rule.comment, rule.media, etc
      if (rule[merger]) {
        if (mergers[merger].merger(rule, i, rules, mergers[merger].map)) {
          i--;
        }
      }
    });
  }
};
