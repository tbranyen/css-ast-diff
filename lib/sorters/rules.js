'use strict';

const compare = require('../compare');
const mergeRules = require('../mergers/rules');
const sortDeclarations = require('./declarations');

module.exports = function sortRules(rules) {

  // merge rules such as media queries, duplicate selectors, etc
  mergeRules(rules);

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];

    // sort subsubrules (namely media queries)
    if (rule.rules) {
      sortRules(rule.rules);
    }

    // sort declarations within rule
    if (rule.declarations) {
      sortDeclarations(rule.declarations);
    }
  }

  // actually sort the rules
  rules.sort(function(a, b) {
    if (a.type === b.type) {
      if (a.selectors && b.selectors) {
        // only one selector per rule thanks to mergers,
        // so we can sort by selectors alphabetically
        var selectorCompare = compare.cs(a.selectors[0], b.selectors[0]);
        if (selectorCompare !== 0) {
          return selectorCompare;
        }
      } else if (a.media && b.media) {
        // sort media queries alphabetically
        return compare.ci(a.media, b.media);
      } else if (a.document && b.document) {
        // sort document queries alphabetically
        return compare.ci(a.vendor + a.document, a.vendor + b.document);
      }

      // all else fails sort by original position
      return a.position.start.line - b.position.start.line;
    } else {
      // sort types alphabetically
      return compare.ci(a.type, b.type);
    }
  });
};
