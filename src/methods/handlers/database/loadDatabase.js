const log = require('evillogger')({ ns:'database/loadDatabase' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'loadDatabase',
    description:'Select a database (if not exist, a new db will be created)',
    properties:{
        'database':{
            alias:['db', 'd'],
            description:'Database name',
            type:'string',
            pattern:shared.RE_DATABASE_NAME,
            patternFlag:'i'
        },
        'options':{
            alias:['opts', 'o'],
            description:'Database options',
            type:'object'
        }
    },
    required:['database']
};

/**
 * return selected database name
 *
 * @example
 * > use test
 * test
 *
 * @param {object} params - ['databaseName']
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, session, callback) {
    const databaseName = params.database;
    const databaseOptions = params.options;

    function ret(result, created) {
        session.loki.currentDatabase = databaseName;
        if (created) {
            log.info(`${session.id}: current database is now ${databaseName} (created)`);
        } else {
            log.info(`${session.id}: current database is now ${databaseName}`);
        }
        callback(null, result);
    }

    shared.getDatabase(databaseName, (err, result) => {
        if (result) {
            ret(result);
            return;
        }

        shared.createDatabase(databaseName, databaseOptions, (err, result) => {
            ret(result, true);
        });
    });

}

module.exports = new Method(descriptor, handler);
