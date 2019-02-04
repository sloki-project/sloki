const log = require('evillogger')({ ns:'loki/remove' });
const shared = require('../shared');
const constants = require('../constants');

function find(databaseName, collectionName, filters, callback) {
    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        callback(null, shared.collections[`${databaseName}.${collectionName}`].find(filters));
    } catch(e) {
        callback({
            code: constants.ERROR_CODE_INTERNAL,
            message: e.message
        });
        log.warn(e);
    }
}

module.exports = find;
