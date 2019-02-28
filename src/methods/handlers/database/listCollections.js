const db = require('../../../db');
const method = require('../../method');

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
function handler(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;

    if (!db.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, db.dbs[databaseName].listCollections());
}

module.exports = new method.Method(descriptor, handler);
