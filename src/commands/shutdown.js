const log = require('evillogger')({ns:'commands'});
const ENV = require('../env');

// story of circular reference so we can't require server at this step,
// need to require it inside shutdown function
let server;

/**
 * Client ask for server shutdown
 *
 * @example
 * > shutdown
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
 function shutdown(params, callback) {
     if (!server) {
         server = require('../server');
     }
     server.stop();
     callback();
}

module.exports = shutdown;
