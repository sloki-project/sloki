const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

/**
 * Client ask for currently selected database
 *
 * @example
 * > db
 * test
 *
 * @param {object} params - database name
 * @param {function} callback - callback
 * @memberof Commands
 */
 function db(params, callback) {
     options.socket.write(options.socket.loki.currentDatabase,{prompt:true});
}

module.exports = db;
