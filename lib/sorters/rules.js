'use strict';

const compare = require('../compare');

module.exports = function sortRules(rules) {
  // map of selectors to their first occurrence's indeces
  var selectorsMap = {};
  // map of media queries to their first occurrence's indeces
  var mediaMap = {};
  // map of document to their first occurrence's indeces
  var documentMap = {};

  var rule;
  var mergeRule;
  var i;
  var j;

  for (i = 0; i < rules.length; i++) {
    rule = rules[i];

    // remove comment nodes
    if (rule.comment) {
      rules.splice(i, 1);
      i--;
      continue;
    }

    if (rule.media) {
      if (typeof mediaMap[rule.media] !== 'undefined') {
        // merge rules with first instance of media query
        mergeRule = rules[mediaMap[rule.media]];
        mergeRule.rules = mergeRule.rules.concat(rule.rules);
        // remove this rule from the list since we merged it up
        rules.splice(i, 1);
        i--;
        continue;
      } else {
        mediaMap[rule.media] = i;
      }
    }

    if (rule.document) {
      if (typeof documentMap[rule.vendor + rule.document] !== 'undefined') {
        // merge rules with first instance of @document
        mergeRule = rules[documentMap[rule.vendor + rule.document]];
        mergeRule.rules = mergeRule.rules.concat(rule.rules);
        // remove this rule from the list since we merged it up
        rules.splice(i, 1);
        i--;
        continue;
      } else {
        documentMap[rule.vendor + rule.document] = i;
      }
    }

    // separate selectors and merge duplicates
    if (rule.selectors) {
      // if rule has multiple selectors, pull them out as their own rules
      if (rule.selectors.length > 1) {
        for (j = 1; j < rule.selectors.length; j++) {
          rules.splice(i + 1, 0, Object.assign({}, rule, {
            selectors: [rule.selectors[j]]
          }));
        }
        rule.selectors = [rule.selectors[0]];
      }

      if (typeof selectorsMap[rule.selectors[0]] !== 'undefined') {
        // merge rules with first instance of selector
        mergeRule = rules[selectorsMap[rule.selectors[0]]];
        mergeRule.declarations = mergeRule.declarations.concat(rule.declarations);
        // remove this rule from the list since we merged it up
        rules.splice(i, 1);
        i--;
        continue;
      } else {
        selectorsMap[rule.selectors[0]] = i;
      }
    }

    if (rule.declarations && rule.declarations.length) {
      for (j = 0; j < rule.declarations.length; j++) {
        var declaration = rule.declarations[j];

        // remove comment nodes from declarations
        if (declaration.type === 'comment' || declaration.comment) {
          rule.declarations.splice(j, 1);
          j--;
        }
      }

      // sort declaration nodes within this rule
      rule.declarations.sort(function(a, b) {
        var propertyCompare = compare.ci(a.property, b.property);
        if (propertyCompare !== 0) {
          return propertyCompare;
        }
        return a.position.start.line - b.position.start.line;
      });
    }
  }

  for (i = 0; i < rules.length; i++) {
    rule = rules[i];
    // sort any sub-rules (namely media queries)
    if (rule.rules) {
      sortRules(rule.rules);
    }
  }

  rules.sort(function(a, b) {
    if (a.type === b.type) {
      if (a.selectors && b.selectors) {
        var selectorCompare = compare.cs(a.selectors[0], b.selectors[0]);
        if (selectorCompare !== 0) {
          return selectorCompare;
        }
      } else if (a.media && b.media) {
        return compare.ci(a.media, b.media);
      } else if (a.document && b.document) {
        return compare.ci(a.vendor + a.document, a.vendor + b.document);
      }

      return a.position.start.line - b.position.start.line;
    } else {
      return compare.ci(a.type, b.type);
    }
  });
};
