const log = require('evillogger')({ns:'loki/insert'});
const shared = require('../shared');

function insert(databaseName, collectionName, doc, callback) {

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    let collectionReference = `${databaseName}.${collectionName}`;
    let collection = shared.collections[collectionReference];

    if (!collection) {
        // collection reference does not exist, let's create reference
        shared.collections[collectionReference] = shared.dbs[databaseName].getCollection(collectionName);
        collection = shared.collections[collectionReference];
        if (!collection) {
            // collection does not exist, let's create a collection without options
            shared.collections[collectionReference] = shared.dbs[databaseName].addCollection(collectionName);
            log.debug(`collection ${collectionName} created in database ${databaseName}`);
            collection = shared.collections[collectionReference];
        }
    }

    if (!collection) {
        // Jayson will make a nice error for us, we don't care about err value
        callback("internalerror");
        return;
    }

    callback(null, collection.insert(doc));
}

module.exports = insert;
