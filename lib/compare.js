'use strict';

module.exports = {
  // case-insensitive
  ci: function(a, b) {
    return a.localeCompare(b, undefined, {
      sensitivity: 'accent',
      colors: true
    });
  },

  cs: function(a, b) {
    return a.localeCompare(b, undefined, {
      sensitivity: 'variant',
      colors: true
    });
  },

  base: function(a, b) {
    return a.localeCompare(b, undefined, {
      sensitivity: 'base',
      colors: true
    });
  }
};
