const log = require('evillogger')({ ns:'collection/remove' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'remove',
    categories:['collection'],
    description:{
        short:'Remove a document by id'
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
            name:'document or document id',
            mandatory:true,
            description:'Document or document ID',
            sanityCheck:{
                type:['number', 'object']
            }
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
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;
    const collectionName = params[0];
    const documentOrId = params[1];

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
