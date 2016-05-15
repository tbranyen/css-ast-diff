'use strict';

module.exports = {
  // base-sensitive, case-insensitive
  // a ≠ b, a = á, a = A.
  ci: function(a, b) {
    return a.localeCompare(b, undefined, {
      sensitivity: 'accent',
      colors: true
    });
  },

  // base- and case-sensitive
  // a ≠ b, a ≠ á, a ≠ A
  cs: function(a, b) {
    return a.localeCompare(b, undefined, {
      sensitivity: 'variant',
      colors: true
    });
  },

  // base- and case-insensitive
  // a ≠ b, a = á, a = A.
  base: function(a, b) {
    return a.localeCompare(b, undefined, {
      sensitivity: 'base',
      colors: true
    });
  }
};
