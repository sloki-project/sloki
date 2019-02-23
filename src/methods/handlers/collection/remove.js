const log = require('evillogger')({ ns:'collection/remove' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'remove',
    description:'Remove a document by id',
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
        },
        'id':{
            description:'Document ID',
            type:'number'
        }
    },
    oneOf:[
        {
            required:['collection', 'document']
        },
        {
            required:['collection', 'id']
        }
    ]
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
    const documentOrId = params.document || params.id;

    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        callback(null, shared.collections[`${databaseName}.${collectionName}`].remove(documentOrId));
    } catch(e) {
        callback({
            code: shared.ERROR_CODE_INTERNAL,
            message: e.message
        });
        log.warn(e);
    }
}

module.exports = new Method(descriptor, handler);
