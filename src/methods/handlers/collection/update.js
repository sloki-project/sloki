const log = require('evillogger')({ ns:'collection/remove' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'update',
    description:'Update a document',
    type: 'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:shared.RE_COLLETION_NAME,
            patternFlag:'i'
        },
        'document':{
            alias:['doc', 'd'],
            description:'Document',
            type:'object'
        }
    },
    required:['collection', 'document']
};

/**
 * remove a document in specified collection
 *
 * @example
 * client> remove myCollection 1
 * { ... }
 *
 * @param {object} params - array[collectionName, documentOrId]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;
    const collectionName = params.collection;
    const doc = params.document;

    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    if (!doc.meta) {
        doc.meta = shared.collections[`${databaseName}.${collectionName}`].get(doc.$loki).meta;
    }

    try {
        callback(null, shared.collections[`${databaseName}.${collectionName}`].update(doc));
    } catch(e) {
        callback({
            code: shared.ERROR_CODE_INTERNAL,
            message: e.message
        });
        log.warn(e);
    }
}

module.exports = new Method(descriptor, handler);
