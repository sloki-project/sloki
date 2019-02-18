const shared = require('../../shared');
const Method = require('../../Method');

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
function handler(params, session, callback) {

    const dbs = [];
    let db;
    for (db of Object.keys(shared.dbs)) {
        dbs.push(db);
    }

    callback(null, dbs);
}

module.exports = new Method(descriptor, handler);
