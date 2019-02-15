const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'getCollection',
    description:'Return collection properties',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:shared.RE_COLLETION_NAME,
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
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;
    const collectionName = params.collection;

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, shared.dbs[databaseName].getCollection(collectionName));
}


module.exports = new Method(descriptor, handler);
