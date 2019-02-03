const log = require('evillogger')({ns:'loki/insert'});
const shared = require('../shared');

function insert(databaseName, collectionName, doc, options, callback) {

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

    if (!options) {
        callback(null, collection.insert(doc));
        return;
    }

    if (options.sret === null) {
        // response sent before insert to win some time
        callback();
        collection.insert(doc);
        return;
    }

    if (options.sret === '01') {
        if (collection.insert(doc)) {
            callback(null, 1);
        } else {
            callback(null, 0);
        }
        return;
    }

    if (options.sret === 'bool') {
        if (collection.insert(doc)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
        return;
    }

    if (options.sret === "id") {
        callback(null, collection.insert(doc).$loki);
    }
}

module.exports = insert;
