const log = require('evillogger')({ns:'databases'});
const ENV = require('../env');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const path = require('path');
const loki = require('lokijs');

const ERROR_CODE_PARAMETER = -32602;

let dbs = {};
let collections = {};

let autosaveInterval = 1000;
let autoload = true;
let autosave = true;
let serializationMethod = "pretty";

function initialize() {

    if (!fs.pathExistsSync(ENV.DATABASES_DIRECTORY)) {
        fs.ensureDirSync(ENV.DATABASES_DIRECTORY);
        log.info('Directory %s created', ENV.DATABASES_DIRECTORY);
    }

    let dbName;

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

function listCollections(databaseName) {
    if (!dbs[databaseName]) return;
    return dbs[databaseName].listCollections();
}

function addCollection(databaseName, collectionName, options) {
    if (!dbs[databaseName]) return;
    let collectionReference = `${databaseName}.${collectionName}`;
    collections[collectionReference] = dbs[databaseName].addCollection(collectionName, options);
    return collections[collectionReference].name;;
}

function getCollection(databaseName, collectionName) {
    if (!dbs[databaseName]) return;
    return dbs[databaseName].getCollection(collectionName);
}

function saveDatabase(databaseName, callback) {
    if (!dbs[databaseName]) {
        callback('E_NO_DATABASE_SELECTED');
        return;
    }
    dbs[databaseName].saveDatabase(callback);
}

function insert(databaseName, collectionName, doc, callback) {
    if (!dbs[databaseName]) {
        callback('E_NO_DATABASE_SELECTED');
        return;
    }

    let collectionReference = `${databaseName}.${collectionName}`;
    let collection = collections[collectionReference];

    if (!collection) {
        // collection reference does not exist, let's create reference
        collections[collectionReference] = dbs[databaseName].getCollection(collectionName);
        collection = collections[collectionReference];
        if (!collection) {
            // collection does not exist, let's create a collection without options
            collections[collectionReference] = dbs[databaseName].addCollection(collectionName);
            collection = collections[collectionReference];
        }
    }

    // return $loki autoincrement id
    callback(null, collection.insert(doc).$loki);
}

function get(databaseName, collectionName, lokiId, callback) {
    if (!dbs[databaseName]) {
        callback('E_NO_DATABASE_SELECTED');
        return;
    }

    let collectionReference = `${databaseName}.${collectionName}`;
    let collection = collections[collectionReference];
    if (!collection) {
        callback({ code: ERROR_CODE_PARAMETER, message: "collection ${collectionName} does not exist" });
        return;
    }

    callback(null, collection.get(lokiId));
}

module.exports = {
    initialize,
    list,
    use,
    listCollections,
    addCollection,
    getCollection,
    saveDatabase,
    insert,
    get
}
