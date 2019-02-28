const method = require('../../method');
const db = require('../../../db');

const descriptor = {
    title:'get',
    description:'Get a document by id',
    type: 'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:db.RE_COLLETION_NAME,
            patternFlag:'i'
        },
        'id':{
            description:'Loki id',
            type:'number'
        }
    },
    required:['collection', 'id']
};

/**
 * get a document by his loki id
 *
 * @example
 * client> get myCollection 1
 * { ... }
 *
 * @param {object} params - array[collectionName, id]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;
    const collectionName = params.collection;
    const lokiId = params.id;

    if (!db.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    const doc = db.collections[`${databaseName}.${collectionName}`].get(lokiId);
    if (doc) {
        callback(null, doc);
        return;
    }

    callback(method.internalError('Object is not a document stored in the collection'));

}

module.exports = new method.Method(descriptor, handler);
