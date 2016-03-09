'use strict';

const path = require('path');

module.exports = (function() {
  var vcs;
  function svn(file, callback) {
    // if callback isnt passed, return a function expecting a callback
    if (!callback) {
      return function(callback) {
        svn(file, callback);
      };
    } else {
      vcs = require('svn-interface');
      vcs.cat(file, function(err, results) {
        // svn-interface returns '1' on err, so grab the error message from results
        if (err) {
          err = {
            message: results
          };
        }
        callback(err, results);
      });
    }
  }

  // TODO: check for unborn branches (head does not exist)
  function git(file, callback) {
    // if callback isnt passed, return a function expecting a callback
    if (!callback) {
      return function(callback) {
        git(file, callback);
      };
    } else {
      vcs = require('nodegit');
      vcs.Repository.open(process.cwd())
        .then(repo => repo.getHeadCommit())
        .then(commit => commit.getTree())
        .then(tree => tree.getEntry(path.relative(process.cwd(), file)))
        .then(treeEntry =>treeEntry.getBlob())
        .then(function(blob) {
          callback(null, blob.toString());
        })
        .catch(function(err) {
          callback(err);
        });
    }
  }

  return {
    svn,
    git
  };
})();
