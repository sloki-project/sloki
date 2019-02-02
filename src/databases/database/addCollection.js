const log = require('evillogger')({ns:'addCollection'});
const shared = require('../shared');

function addCollection(databaseName, collectionName, options, callback) {

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    shared.collections[`${databaseName}.${collectionName}`] = shared.dbs[databaseName].addCollection(collectionName, options);
    callback(null, shared.collections[`${databaseName}.${collectionName}`]);
    log.debug(`collection ${databaseName}.${collectionName} created`);
}

module.exports = addCollection;
