const log = require('evillogger')({ ns:'collection/find' });
const db = require('../../../db');
const method = require('../../handler');

const descriptor = {
    title:'find',
    description:'Find a document',
    type: 'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:db.RE_COLLETION_NAME,
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
function handler(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;
    const collectionName = params.collection;
    const filters = params.filters;

    if (!db.collectionExists(databaseName, collectionName, callback)) {
        return;
    }

    try {
        callback(null, db.collections[`${databaseName}.${collectionName}`].find(filters));
    } catch(e) {
        callback(method.internalError(e.message));
        log.warn(e);
    }
}

module.exports = new method.Method(descriptor, handler);
