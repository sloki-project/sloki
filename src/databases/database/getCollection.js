const shared = require('../shared');

function getCollection(databaseName, collectionName, callback) {

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, shared.dbs[databaseName].getCollection(collectionName));
}

module.exports = getCollection;
