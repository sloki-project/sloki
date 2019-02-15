const log = require('evillogger')({ ns:'database/loadDatabase' });
const shared = require('../../shared');
const Method = require('../../Method');
const path = require('path');
const loki = require('lokijs');

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
function handler(params, callback, socket) {
    const databaseName = params.database;
    const databaseOptions = params.options;

    if (shared.dbs[databaseName]) {
        socket.loki.currentDatabase = databaseName;
        log.info(`${socket.id}: current database is now ${databaseName} (loaded)`);
        callback(null, shared.dbs[databaseName]);
        return;
    }

    const dbPath = path.resolve(shared.ENV.DATABASES_DIRECTORY+`/${databaseName}.json`);
    const options = Object.assign(shared.DEFAULT_DATABASE_OPTIONS, databaseOptions||{});

    options.autoloadCallback = () => {
        socket.loki.currentDatabase = databaseName;
        log.info(`${socket.id}: current database is now ${databaseName} (created)`);
        callback(null, shared.dbs[databaseName]);
    };

    //log.info(`${socket.id}: creating database ${databaseName}`);
    shared.dbs[databaseName] = new loki(dbPath, options);

    // by default, immediate save (force flush) after creating database
    shared.ENV.DATABASES_FORCE_SAVE_ON_CREATE && shared.dbs[databaseName].save();

}

module.exports = new Method(descriptor, handler);
