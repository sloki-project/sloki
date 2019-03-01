const log = require('evillogger')({ ns:'database/saveDatabase' });
const db = require('../../../db');
const handler = require('../../handler');

const descriptor = {
    title:'saveDatabase',
    description:'Force save of currently selected database'
};


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
function handle(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;

    if (!db.databaseSelected(databaseName, callback)) {
        return;
    }

    try {
        db.dbs[databaseName].saveDatabase(err => {
            if (err) {
                callback(handler.internalError(err.message));
                return;
            }
            callback(null, { success:true });
        });
    } catch(e) {
        log.error(e);
        callback(handler.internalError(e.message));
    }
}

module.exports = new handler.Method(descriptor, handle);
