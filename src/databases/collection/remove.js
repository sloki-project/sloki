const log = require('evillogger')({ns:'loki/remove'});
const shared = require('../shared');
const constants = require('../constants');

function remove(databaseName, collectionName, documentOrId, callback) {
    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        let result = shared.collections[`${databaseName}.${collectionName}`].remove(documentOrId);
        callback(null, result);
    } catch(e) {
        callback({
            code: constants.ERROR_CODE_INTERNAL,
            message: e.message
        });
        log.warn(e);
    }
}

module.exports = remove;
