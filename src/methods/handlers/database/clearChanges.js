const log = require('evillogger')({ ns:'database/clearChanges' });
const db = require('../../../db');
const handler = require('../../handler');

const descriptor = {
    title:'clearChanges',
    description:'Clears all the changes in all collections'
};


/**
 * clearChanges selected database
 *
 * @example
 * > clearChanges
 * success
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
        db.dbs[databaseName].clearChanges();
        callback(null, { success:true });
    } catch(e) {
        log.error(e);
        callback(handler.internalError(e.message));
    }
}

module.exports = new handler.Method(descriptor, handle);
