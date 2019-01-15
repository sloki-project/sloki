const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const sprintf = require('sprintf-js').sprintf;
const moment = require('moment');
require('moment-duration-format');

/**
 * Client ask for clients list
 *
 * @example
 * > show clients
 * ...
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function showClients(params, callback) {
    callback(null, Object.keys(this.server.clients));
}

module.exports = showClients;
