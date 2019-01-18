const log = require('evillogger')({ns:'databases'});
const ENV = require('../env');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const path = require('path');
const loki = require('lokijs');

let dbName;
let dbs = {};
let autosaveInterval = 1000;
let autoload = true;
let autosave = true;
let serializationMethod = "pretty";

function initialize() {
    if (!fs.pathExistsSync(ENV.DATABASES_DIRECTORY)) {
        fs.ensureDirSync(ENV.DATABASES_DIRECTORY);
        log.info('Directory %s created', ENV.DATABASES_DIRECTORY);
    }


    for (file of klawSync(ENV.DATABASES_DIRECTORY)) {
        dbName = path.basename(file.path).replace(/\.json/,'');
        log.info("Loading database '%s'", dbName, file.path);

        dbs[dbName] = new loki(file.path, {autoload, autosave, autosaveInterval});
    }

    let dbTestFile = path.resolve(ENV.DATABASES_DIRECTORY+'/test.json');

    if (!dbs['test']) {
        dbs['test'] = new loki(dbTestFile, {serializationMethod, autoload, autosave, autosaveInterval});
        dbs['test'].save();
    }
}

function list() {
    let tmp = [];
    for (db of Object.keys(dbs)) {
        tmp.push(db);
    }
    return tmp;
}

function use(databaseName, callback) {

    if (dbs[databaseName]) {
        callback(null, dbs[databaseName]);
        return;
    }

    let dbPath = path.resolve(ENV.DATABASES_DIRECTORY+'/'+databaseName+'.json');
    dbs[databaseName] = new loki(dbPath, {
        serializationMethod,
    	autoload,
    	autosave,
    	autosaveInterval,
        autoloadCallback: () => {
            callback(null, dbs[databaseName]);
        }
    });
    dbs[databaseName].save();
}

function listCollections(db) {
    if (!dbs[db]) return;
    return dbs[db].listCollections();
}

function addCollection(db, collectionName, options) {
    if (!dbs[db]) return;
    return dbs[db].addCollection(collectionName, options).name;
}

function getCollection(db, collectionName) {
    if (!dbs[db]) return;
    return dbs[db].getCollection(collectionName);
}

function saveDatabase(db, callback) {
    if (!dbs[db]) {
        callback('E_NO_DATABASE_SELECTED');
        return;
    }
    dbs[db].saveDatabase(callback);
}

module.exports = {
    initialize,
    list,
    use,
    listCollections,
    addCollection,
    getCollection,
    saveDatabase
}
