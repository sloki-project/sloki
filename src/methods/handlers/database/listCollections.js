const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'listCollections',
    description:'Return collections in currently selected database'
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
function handler(params, session, callback) {
    const databaseName = session.loki.currentDatabase;

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, shared.dbs[databaseName].listCollections());
}

module.exports = new Method(descriptor, handler);
