const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const databases = require('../../databases');

/**
 * return databases list
 *
 * @example
 * client> listDatabases
 * ['test']
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function listDatabases(params, callback) {
    callback(null, databases.list());
}

module.exports = listDatabases;
