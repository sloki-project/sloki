const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'listCollections',
    categories:['database'],
    description:{
        short:'Return collections in currently selected database',
    },
    parameters:[]
};

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
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, shared.dbs[databaseName].listCollections());
}

module.exports = new Method(descriptor, handler);
