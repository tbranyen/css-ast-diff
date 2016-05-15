'use strict';

// TODO: unused?

const util = require('util');

module.exports = {
  /**
   * Cover for console.log
   * @returns {void}
   */
  info: function() {
    console.info.apply(console, Array.prototype.slice.call(arguments));
  },

  /**
   * Cover for console.error
   * @returns {void}
   */
  error: function() {
    console.error.apply(console, Array.prototype.slice.call(arguments));
  },

  /**
   * Cover for util.inspect
   * @param {Object} obj - The object to inspect
   * @param {int} [depth=null] - Depth of recursion on object
   * @returns {void}
   */
  obj: function(obj, depth) {
    depth = typeof depth === 'undefined' ? null : depth;
    console.log(util.inspect(obj, {
      depth: depth,
      colors: true
    }));
  }
};
