const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

let databases;

/**
 * Client ask for databases list
 *
 * @example
 * client> showDatabases
 * server> BYE
 *
 * @param {object} params - null
 * @param {function} callback - callback
 * @memberof Commands
 */
function showDatabases(params, callback) {
    if (!databases) {
        databases = require('../../databases');
    }
    callback(null, databases.listSync());
}

module.exports = showDatabases;
