const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'listDatabases',
    categories:['database'],
    description:{
        short:'Return available databases',
    },
    parameters:[]
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
function handler(params, callback) {

    const dbs = [];
    let db;
    for (db of Object.keys(shared.dbs)) {
        dbs.push(db);
    }

    callback(null, dbs);
}

module.exports = new Method(descriptor, handler);
