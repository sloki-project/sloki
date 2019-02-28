const db = require('../../../db');
const method = require('../../method');

const descriptor = {
    title:'getCollection',
    description:'Return collection properties',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:db.RE_COLLETION_NAME,
            patternFlag:'i'
        }
    },
    required:['collection']
};

/**
 * return collection properties
 *
 * @example
 * client> get myCollection
 * myCollection
 *
 * @param {object} params - array['collectionName']
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;
    const collectionName = params.collection;

    if (!db.databaseSelected(databaseName, callback)) {
        return;
    }

    const collectionProperties = db.dbs[databaseName].getCollection(collectionName);
    if (collectionProperties) {
        callback(null, collectionProperties);
    } else {
        callback(method.internalError('Collection does not exist'));
    }
}


module.exports = new method.Method(descriptor, handler);
