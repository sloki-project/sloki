const log = require('evillogger')({ ns:'database/removeCollection' });
const db = require('../../../db');
const handler = require('../../handler');

const descriptor = {
    title:'removeCollection',
    description:'Remove entire collection',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:db.RE_COLLETION_NAME,
            patternFlag:'i'
        }
    },
    required:['collection']
};


/**
 * remove a collection
 *
 * @example
 * > removeCollection collectionName
 * success
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handle(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;
    const collectionName = params.collection;

    if (!db.databaseSelected(databaseName, callback)) {
        return;
    }

    try {
        const removed = db.dbs[databaseName].removeCollection(collectionName);
        const collectionReference = `${databaseName}.${collectionName}`;
        delete db.collections[collectionReference];
        callback(null, { success:removed });
    } catch(e) {
        log.error(e);
        callback(handler.internalError(e.message));
    }
}

module.exports = new handler.Method(descriptor, handle);
