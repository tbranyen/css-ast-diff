#!/usr/bin/env node
'use strict';

const argv = require('yargs').argv;
const async = require('async');
const colors = require('colors');
const css = require('css');
const DiffMatchPatch = require('diff-match-patch');
const dmp = new DiffMatchPatch();
const fs = require('fs');
const path = require('path');
const svn = require('svn-interface');
const util = require('util');

var cli = {};

console.obj = console.obj || function (obj, depth) {
  depth = typeof depth === 'undefined' ? null : depth;
  console.log(util.inspect(obj, {
    depth: depth,
    colors: true
  }));
};

cli._baseCompare = function (a, b) {
  return a.localeCompare(b, undefined, {
    sensitivity: 'base',
    colors: true
  });
};

cli._ruleSort = function (rules) {
  // map of selectors to their first occurrence's indeces
  var selectorsMap = {};
  // map of media queries to their first occurrence's indeces
  var mediaMap = {};

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
      rule.declarations.sort(function (a, b) {
        var propertyCompare = cli._baseCompare(a.property, b.property);
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
      cli._ruleSort(rule.rules);
    }
  }

  rules.sort(function (a, b) {
    if (a.type === b.type) {
      if (a.selectors && b.selectors) {
        var selectorCompare = cli._baseCompare(a.selectors[0], b.selectors[0]);
        if (selectorCompare !== 0) {
          return selectorCompare;
        }
      } else if (a.media && b.media) {
        return cli._baseCompare(a.media, b.media);
      } else if (a.document && b.document) {
        return cli._baseCompare(a.document, b.document);
      }

      return a.position.start.line - b.position.start.line;
    } else {
      return cli._baseCompare(a.type, b.type);
    }
  });
};

cli._astSort = function (ast) {
  cli._ruleSort(ast.stylesheet.rules);
};

cli.parse = function () {

  console.log(argv._);

  async.parallel([
    function (callback) {
      svn.cat(path.join(process.cwd(), argv._[0]), callback);
    },
    function (callback) {
      fs.readFile(path.join(process.cwd(), argv._[0]), 'utf8', callback);
    }
  ],
  function (err, results) {
    var src;
    for (var i = 0; i < results.length; i++) {
      src = results[i];

      results[i] = {
        src: src,
        ast: css.parse(src)
      };

      cli._astSort(results[i].ast);
      results[i].src = css.stringify(results[i].ast);
    }

    fs.writeFileSync(path.join(process.cwd(), '/reports/') + 'svn.css', results[0].src);
    fs.writeFileSync(path.join(process.cwd(), '/reports/') + 'app.css', results[1].src);

    src = results[0].src;
    var diff = results[1].src;

    diff = dmp.diff_main(src, diff);

    diff.forEach(function(change){
      if (change[0] === DiffMatchPatch.DIFF_DELETE) {
        // console.obj(change);
        console.log(colors.red('\n' + change[1]));
      } else if (change[0] === DiffMatchPatch.DIFF_INSERT) {
        // console.obj(change);
        console.log(colors.green('\n' + change[1]));
      } else if (change[0] === DiffMatchPatch.DIFF_EQUAL) {
        // do nothing
        // console.obj(change);
      }
    });
  });

};

cli.parse();
