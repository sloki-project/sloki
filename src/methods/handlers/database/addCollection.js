const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    title:'addCollection',
    description:'Add a collection into currently selected database',
    type:'object',
    properties:{
        'collection':{
            description:'Collection name',
            type:'string',
            pattern:shared.RE_COLLETION_NAME,
            patternFlag:'i'
        },
        'options':{
            description:'Collection options',
            type:'object'
        }
    },
    required:['collection']
};

/**
 * add a collection in selected database
 *
 * @example
 * client> addCollection myCollection
 * myCollection
 *
 * @param {object} params - array['collectionName', options]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;
    const collectionName = params.collection;
    const collectionOptions = params.options;

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    shared.collections[`${databaseName}.${collectionName}`] = shared.dbs[databaseName].addCollection(collectionName, collectionOptions);
    callback(null, shared.collections[`${databaseName}.${collectionName}`]);
}

module.exports = new Method(descriptor, handler);
