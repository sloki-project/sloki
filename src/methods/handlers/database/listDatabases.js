const db = require('../../../db');
const handler = require('../../handler');

const descriptor = {
    title:'listDatabases',
    description:'Return available databases'
};

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
function handle(params, context, callback) {

    const dbs = [];
    for (const dbName of Object.keys(db.dbs)) {
        dbs.push(dbName);
    }

    callback(null, dbs);
}

module.exports = new handler.Method(descriptor, handle);
