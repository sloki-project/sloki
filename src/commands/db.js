const log = require('evillogger')({ns:'commands'});
const ENV = require('../env');

/**
 * Client ask for currently selected database
 *
 * @example
 * > db
 * test
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
 function db(params, callback) {
     callback(null, this.loki.currentDatabase);
}

module.exports = db;
