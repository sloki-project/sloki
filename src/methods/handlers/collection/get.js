const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'get',
    description:'Get a document by id',
    type: 'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:shared.RE_COLLETION_NAME,
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
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;
    const collectionName = params.collection;
    const lokiId = params.id;

    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }
    callback(null, shared.collections[`${databaseName}.${collectionName}`].get(lokiId));
}

module.exports = new Method(descriptor, handler);
