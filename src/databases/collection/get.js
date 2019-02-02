const shared = require('../shared');

function get(databaseName, collectionName, lokiId, callback) {
    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }
    callback(null, shared.collections[`${databaseName}.${collectionName}`].get(lokiId));
}

module.exports =  get;
