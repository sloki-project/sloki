const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

/**
 * Client ask for maxClients
 *
 * @example
 * > getMaxClients
 * 10
 *
 * @param {object} params - null
 * @param {function} callback - callback
 * @memberof Commands
 */
function maxClients(params, callback) {
    callback(null, ENV.NET_TCP_MAX_CLIENTS);
}

module.exports = maxClients;
