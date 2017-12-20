/*
 * Logging module for test
 * Copied Restbase
 */
'use strict';

var bunyan = require('bunyan');

function logStream() {

  var log = [];
  var parrot = bunyan.createLogger({
    name: 'test-logger',
    level: 'warn'
  });

  function write(chunk) {
    try {
        var entry = JSON.parse(chunk);
        var levelMatch = /^(\w+)/.exec(entry.levelPath);
        if (levelMatch) {
            var level = levelMatch[1];
            if (parrot[level]) {
                parrot[level](entry);
            }
        }
    } catch (e) {
        console.error('something went wrong trying to parrot a log entry', e, chunk);
    }

    log.push(chunk);
  }

  // to implement the stream writer interface
  function end() {
  }

  function get() {
    return log;
  }

  function slice() {

    var begin = log.length;
    var end   = null;

    function halt() {
      if (end === null) {
        end = log.length;
      }
    }

    function get() {
      return log.slice(begin, end);
    }

    return {
      halt: halt,
      get: get
    };

  }

  return {
    write: write,
    end: end,
    slice: slice,
    get: get
  };
}

module.exports = logStream;
