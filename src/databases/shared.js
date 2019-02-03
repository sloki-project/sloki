const log = require('evillogger')({ ns:'loki/shared' });
const constants = require('./constants');

const dbs = {};
const collections = {};


function databaseSelected(databaseName, callback) {
    if (dbs[databaseName]) {
        return true;
    }

    const msg = 'no database selected';

    callback({
        code: constants.ERROR_CODE_INTERNAL,
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
        code: constants.ERROR_CODE_PARAMETER,
        message: msg
    });

    log.debug(msg);

    return false;
}


module.exports = {
    dbs,
    collections,
    databaseSelected,
    collectionExists
};
