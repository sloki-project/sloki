const shared = require('../shared');

function saveDatabase(databaseName, callback) {
    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    shared.dbs[databaseName].saveDatabase(callback);
}

module.exports = saveDatabase;
