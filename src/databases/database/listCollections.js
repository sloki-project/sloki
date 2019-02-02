const shared = require('../shared');

function listCollections(databaseName, callback) {
    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, shared.dbs[databaseName].listCollections());
}

module.exports = listCollections;
