const log = require('evillogger')({ ns:'methods/shared' });
const path = require('path');
const loki = require('lokijs');

const config = require('../config');

const dbs = {};
const collections = {};

// http://jsonrpc.org/spec.html#error_object
const ERROR_CODE_PARAMETER = -32602;
const ERROR_CODE_INTERNAL = -32603;

const DEFAULT_DATABASE_OPTIONS =  {
    serializationMethod:'pretty',
    autoload:true,
    autosave:true,
    autosaveInterval:config.DATABASES_AUTOSAVE_INTERVAL
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

function getDatabase(databaseName, callback) {
    if (!dbs[databaseName]) {
        callback(null, undefined);
        return;
    }

    // avoid circular structure: ignore autosaveHandle, persistenceAdapter
    callback(null, {
        filename:dbs[databaseName].filename,
        databaseVersion:dbs[databaseName].databaseVersion,
        engineVersion:dbs[databaseName].engineVersion,
        autosave:dbs[databaseName].autosave,
        autosaveInterval:dbs[databaseName].autosaveInterval,
        throttledSaves:dbs[databaseName].throttledSaves,
        options:dbs[databaseName].options,
        persistenceMethod:dbs[databaseName].persistenceMethod,
        persistenceAdapter:typeof dbs[databaseName].persistenceAdapter,
        throttledSavePending:dbs[databaseName].throttledSavePending,
        verbose:dbs[databaseName].verbose,
        ENV:dbs[databaseName].ENV,
        name:dbs[databaseName].name
    });
}

function createDatabase(databaseName, databaseOptions, callback) {

    const dbPath = path.resolve(config.SLOKI_DIR+`/${databaseName}.json`);
    const options = Object.assign(DEFAULT_DATABASE_OPTIONS, databaseOptions||{});

    options.autoloadCallback = () => {
        getDatabase(databaseName, (err, result) => {
            callback(null, result);
        });
    };

    dbs[databaseName] = new loki(dbPath, options);

    // by default, immediate save (force flush) after creating database
    config.DATABASES_FORCE_SAVE_ON_CREATE && dbs[databaseName].save();
}

module.exports = {
    getDatabase,
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
