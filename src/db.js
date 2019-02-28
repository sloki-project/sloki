const log = require('evillogger')({ ns:'db' });
const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const async = require('async');
const loki = require('lokijs');
const lokilfsa = require(process.cwd()+'/node_modules/lokijs/src/loki-fs-structured-adapter.js');

const config = require('./config');

const dbs = {};
const collections = {};

function initialize(callback) {

    if (!fs.pathExistsSync(config.SLOKI_DIR_DBS)) {
        fs.ensureDirSync(config.SLOKI_DIR_DBS);
        log.info(`directory ${config.SLOKI_DIR_DBS} created`);
    }

    let file;

    log.info(`loading databases from ${config.SLOKI_DIR_DBS}`);

    const dbs = [];

    for (file of klawSync(config.SLOKI_DIR_DBS)) {
        if (file.path.match(/\.(json|db)$/)) {
            dbs.push(path.basename(file.path).replace(/\.(json|db)/, ''));
        }
    }

    if (dbs.indexOf('test')<0) {
        dbs.push('test');
    }

    async.each(dbs, (db, next) => {
        log.info(`loading database ${db}`);
        loadDatabaseFromDisk(db, () => {
            log.info(`database ${db} loaded`);
            next();
        });
    }, callback);
}

function databaseSelected(databaseName, callback) {
    if (dbs[databaseName]) {
        return true;
    }

    const msg = 'no database selected';

    callback({
        code: config.ERROR_CODE_INTERNAL,
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
        code: config.ERROR_CODE_PARAMETER,
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
    const options = JSON.parse(JSON.stringify(config.DATABASES_DEFAULT_OPTIONS));

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

    const options = getDatabaseOptions(databaseName, databaseOptions);

    dbs[databaseName] = new loki(dbPath, options);

    // save on create when adapter specified
    dbs[databaseName].save((err) => {
        if (callback) {
            callback(err, getDatabaseProperties(databaseName));
        }
    });

    return dbs[databaseName];
}


function loadDatabaseFromDisk(databaseName, callback) {
    const dbPath = path.resolve(config.SLOKI_DIR_DBS+`/${databaseName}.db`);
    const options = getDatabaseOptions(databaseName, null, callback);
    dbs[databaseName] = new loki(dbPath, options);
}

module.exports = {
    initialize,
    databaseSelected,
    collectionExists,
    getDatabaseProperties,
    getDatabaseOptions,
    createDatabase,
    loadDatabaseFromDisk,
    dbs,
    collections
};
