const log = require('evillogger')({ ns:'methods/shared' });
const ENV = require('../env');

const dbs = {};
const collections = {};

const ERROR_CODE_PARAMETER = -32602;
const ERROR_CODE_INTERNAL = -32603;

const DEFAULT_DATABASE_OPTIONS =  {
    serializationMethod:'pretty',
    autoload:true,
    autosave:true,
    autosaveInterval:ENV.DATABASES_AUTOSAVE_INTERVAL
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

module.exports = {
    dbs,
    collections,
    databaseSelected,
    collectionExists,
    RE_COLLETION_NAME: '^[a-z0-9\-\.\_]{1,50}$',
    RE_DATABASE_NAME: '^[a-z0-9\-\.\_]{1,50}$',
    DEFAULT_DATABASE_OPTIONS,
    ERROR_CODE_PARAMETER,
    ERROR_CODE_INTERNAL,
    ENV
};
