const log = require('evillogger')({ ns:'methods/shared' });
const path = require('path');
const loki = require('lokijs');
const lokilfsa = require(process.cwd()+'/node_modules/lokijs/src/loki-fs-structured-adapter.js');

const config = require('../config');

const dbs = {};
const collections = {};

// http://jsonrpc.org/spec.html#error_object
const ERROR_CODE_PARAMETER = -32602;
const ERROR_CODE_INTERNAL = -32603;

const DEFAULT_DATABASE_OPTIONS =  {
    //serializationMethod:'pretty',
    autoload:true,
    autosave:true,
    autosaveInterval:config.DATABASES_AUTOSAVE_INTERVAL,
};

function databaseSelected(databaseName, callback) {
    if (dbs[databaseName]) {
        return true;
    }

    const msg = 'no database selected';

    callback({
        code: ERROR_CODE_INTERNAL,
        message: msg
    });

    log.debug(msg);

    return false;
}

function collectionExists(databaseName, collectionName, callback) {

    if (collections[`${databaseName}.${collectionName}`]) {
        return true;
    }

    if (!databaseSelected(databaseName, callback)) {
        return false;
    }

    const msg = `collection ${collectionName} does not exist in database ${databaseName}`;

    callback({
        code: ERROR_CODE_PARAMETER,
        message: msg
    });

    log.debug(msg);

    return false;
}

function getDatabaseProperties(databaseName, callback) {
    const rdb = dbs[databaseName];
    if (!rdb) {
        if (callback) {
            callback(null, undefined);
        }
        return undefined;
    }

    // avoid circular structure: ignore autosaveHandle, persistenceAdapter
    const db = {
        filename:rdb.filename,
        databaseVersion:rdb.databaseVersion,
        engineVersion:rdb.engineVersion,
        autosave:rdb.autosave,
        autosaveInterval:rdb.autosaveInterval,
        throttledSaves:rdb.throttledSaves,
        options:rdb.options,
        persistenceMethod:rdb.persistenceMethod,
        persistenceAdapter:typeof rdb.persistenceAdapter,
        throttledSavePending:rdb.throttledSavePending,
        verbose:rdb.verbose,
        ENV:rdb.ENV,
        name:rdb.name
    };

    //console.log('getDatabase', db);

    if (callback) {
        callback(null, db);
    }

    return db;
}

function getDatabaseOptions(databaseName, databaseOptions, callback) {
    const options = {};

    for (const prop in DEFAULT_DATABASE_OPTIONS) {
        if (DEFAULT_DATABASE_OPTIONS.hasOwnProperty(prop)) {
            options[prop] = DEFAULT_DATABASE_OPTIONS[prop];
        }
    }

    for (const prop in databaseOptions||{}) {
        if (databaseOptions.hasOwnProperty(prop)) {
            options[prop] = databaseOptions[prop];
        }
    }

    options.adapter = new lokilfsa();

    if (callback) {
        options.autoloadCallback = (err) => {
            if (callback) {
                callback(err, getDatabaseProperties(databaseName));
            }
        };
    }

    return options;
}

function createDatabase(databaseName, databaseOptions, callback) {

    if (typeof databaseOptions === 'function') {
        callback = databaseOptions;
        databaseOptions = null;
    }

    const dbPath = path.resolve(config.SLOKI_DIR_DBS+`/${databaseName}.db`);
    const options = getDatabaseOptions(databaseName, databaseOptions, callback);

    dbs[databaseName] = new loki(dbPath, options);

    // save on create when adapter specified
    if (options.adapter) {
        dbs[databaseName].save((err) => {
            if (callback) {
                callback(err, getDatabaseProperties(databaseName));
            }
        });
    }

    return dbs[databaseName];
}


function loadDatabaseFromDisk(databaseName, callback) {
    const dbPath = path.resolve(config.SLOKI_DIR_DBS+`/${databaseName}.db`);
    const options = getDatabaseOptions(databaseName, null, callback);
    dbs[databaseName] = new loki(dbPath, options);
}

module.exports = {
    getDatabaseProperties,
    loadDatabaseFromDisk,
    createDatabase,
    dbs,
    collections,
    databaseSelected,
    collectionExists,
    RE_COLLETION_NAME: '^[a-z0-9\-\.\_]{1,50}$',
    RE_DATABASE_NAME: '^[a-z0-9\-\.\_]{1,50}$',
    DEFAULT_DATABASE_OPTIONS,
    ERROR_CODE_PARAMETER,
    ERROR_CODE_INTERNAL
};
