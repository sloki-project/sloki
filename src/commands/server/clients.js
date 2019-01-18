const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

/**
 * return TCP/TLS connected clients
 *
 * @example
 * > clients
 * ['127.0.0.1:1379']
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function clients(params, callback) {
    callback(null, Object.keys(this.server.clients));
}

module.exports = clients;
