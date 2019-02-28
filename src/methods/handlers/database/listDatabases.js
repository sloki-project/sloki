const db = require('../../../db');
const method = require('../../method');

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
function handler(params, context, callback) {

    const dbs = [];
    for (const dbName of Object.keys(db.dbs)) {
        dbs.push(dbName);
    }

    callback(null, dbs);
}

module.exports = new method.Method(descriptor, handler);
