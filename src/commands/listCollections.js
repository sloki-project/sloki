const log = require('evillogger')({ns:'commands'});
const ENV = require('../env');
const databases = require('../databases');

/**
 * return collections of current selected database
 *
 * @example
 * client> listCollections
 * []
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function listCollections(params, callback) {
    callback(null, databases.listCollections(this.loki.currentDatabase));
}

module.exports = listCollections;
