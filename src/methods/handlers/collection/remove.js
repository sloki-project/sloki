const log = require('evillogger')({ ns:'collection/remove' });
const method = require('../../method');
const db = require('../../../db');

const descriptor = {
    title:'remove',
    description:'Remove a document by id',
    type: 'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:db.RE_COLLETION_NAME,
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

    if (!db.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        callback(null, db.collections[`${databaseName}.${collectionName}`].remove(documentOrId));
    } catch(e) {
        callback(method.internalError(e.message));
        log.warn(e);
    }
}

module.exports = new method.Method(descriptor, handler);
