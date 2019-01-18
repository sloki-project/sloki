const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const databases = require('../../databases');

/**
 * save selected database
 *
 * @example
 * > saveDatabase
 * test
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
 function saveDatabase(params, callback) {
     databases.saveDatabase(this.loki.currentDatabase, (err) => {
         callback(err, this.loki.currentDatabase);
     })
}

module.exports = saveDatabase;
