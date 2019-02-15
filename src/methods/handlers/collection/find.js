const log = require('evillogger')({ ns:'collection/find' });
const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'find',
    description:'Find a document',
    type: 'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:shared.RE_COLLETION_NAME,
            patternFlag:'i'
        },
        'filters':{
            alias:['f'],
            description:'Filters',
            type:'object'
        }
    },
    required:['collection']
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
    const collectionName = params.collection;
    const filters = params.filters;

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
