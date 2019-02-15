const log = require('evillogger')({ ns:'collection/insert' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'insert',
    description:'Insert a document',
    type: 'object',
    properties:{
        'collection':{
            description:'Collection name',
            type:'string',
            pattern:shared.RE_COLLETION_NAME,
            patternFlag:'i'
        },
        'document':{
            description:'Document',
            type:'object'
        },
        'options':{
            description:'Insert options',
            type:'object'
        }
    },
    required:['collection', 'document']
};

/**
 * insert a record in a collection, return the document
 *
 * @example
 * client> insert myCollection {"foo":"bar"}
 * {"foo":"bar"}
 *
 * @param {object} params - array[collectionName, document, options]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;
    const collectionName = params.collection;
    const doc = params.document;
    const options = params.options;

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    const collectionReference = `${databaseName}.${collectionName}`;
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
        callback('internalerror');
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

    if (options.sret === 'id') {
        callback(null, collection.insert(doc).$loki);
    }
}

module.exports = new Method(descriptor, handler);
