const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'get',
    categories:['collection'],
    description:{
        short:'Get a document by id'
    },
    parameters:[
        {
            name:'Collection name',
            mandatory:true,
            description:'Collection name',
            sanityCheck:{
                type:'string',
                reString:shared.RE_COLLETION_NAME,
                reFlag:'i'
            }
        },
        {
            name:'Unique ID',
            mandatory:true,
            description:'Loki id',
            sanityCheck:{
                type:'number'
            }
        }
    ]
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
    const collectionName = params[0];
    const lokiId = params[1];

    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }
    callback(null, shared.collections[`${databaseName}.${collectionName}`].get(lokiId));
}

module.exports = new Method(descriptor, handler);
