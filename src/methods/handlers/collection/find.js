const log = require('evillogger')({ ns:'collection/find' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'find',
    categories:['collection'],
    description:{
        short:'Find a document'
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
            name:'Filters',
            mandatory:true,
            description:'Filters',
            sanityCheck:{
                type:'object'
            }
        }
    ]
};

/**
 * find a record in a collection, return the document
 *
 * @example
 * client> find myCollection {"foo":"bar"}
 * {"foo":"bar"}
 *
 * @param {object} params - array[collectionName, filters]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;
    const collectionName = params[0];
    const filters = params[1];

    if (!shared.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        callback(null, shared.collections[`${databaseName}.${collectionName}`].find(filters));
    } catch(e) {
        callback({
            code: shared.ERROR_CODE_INTERNAL,
            message: e.message
        });
        log.warn(e);
    }
}

module.exports = new Method(descriptor, handler);
