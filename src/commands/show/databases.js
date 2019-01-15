const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const databases = require('../../databases');

/**
 * Client ask for databases list
 *
 * @example
 * client> showDatabases
 * server> BYE
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function showDatabases(params, callback) {
    callback(null, databases.listSync());
}

module.exports = showDatabases;
