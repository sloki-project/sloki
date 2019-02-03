const log = require('evillogger')({ ns:'loki/remove' });
const shared = require('../shared');
const constants = require('../constants');

function remove(databaseName, collectionName, documentOrId, callback) {
    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        callback(null, shared.collections[`${databaseName}.${collectionName}`].remove(documentOrId));
    } catch(e) {
        callback({
            code: constants.ERROR_CODE_INTERNAL,
            message: e.message
        });
        log.warn(e);
    }
}

module.exports = remove;
