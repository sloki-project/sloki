const db = require('../../../db');
const handler = require('../../handler');

const descriptor = {
    title:'deleteDatabase',
    description:'Delete currently selected database',
    properties:{
        'database':{
            alias:['db', 'd'],
            description:'Database name',
            type:'string',
            pattern:db.RE_DATABASE_NAME,
            patternFlag:'i'
        },
    },
    required:['database']
};


/**
 * delete selected database
 *
 * @example
 * > deleteDatabase
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

    delete db.dbs[databaseName];
    callback(null, { success:true });
}

module.exports = new handler.Method(descriptor, handle);
