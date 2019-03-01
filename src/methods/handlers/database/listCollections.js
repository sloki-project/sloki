const db = require('../../../db');
const handler = require('../../handler');

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
function handle(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;

    if (!db.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, db.dbs[databaseName].listCollections());
}

module.exports = new handler.Method(descriptor, handle);
