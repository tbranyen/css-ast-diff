'use strict';

const compare = require('../compare');

module.exports = function sortDeclarations(declarations) {
  for (var j = 0; j < declarations.length; j++) {
    var declaration = declarations[j];

    // remove comment nodes from declarations
    if (declaration.type === 'comment' || declaration.comment) {
      declarations.splice(j, 1);
      j--;
    }

    // normalize whitespace
    if (declaration.value) {
      declaration.value = declaration.value.replace(/\s*!important/g, ' !important').replace(/\s+/g, ' ');
    }
  }

  // sort declaration nodes within this rule
  declarations.sort(function(a, b) {
    var propertyCompare = compare.ci(a.property, b.property);
    if (propertyCompare !== 0) {
      return propertyCompare;
    }
    return a.position.start.line - b.position.start.line;
  });
};
