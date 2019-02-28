const method = require('../../method');
const db = require('../../../db');

const descriptor = {
    title:'addCollection',
    description:'Add a collection into currently selected database',
    type:'object',
    properties:{
        'collection':{
            alias:['col', 'c'],
            description:'Collection name',
            type:'string',
            pattern:db.RE_COLLETION_NAME,
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
function handler(params, context, callback) {
    const databaseName = context.session.loki.currentDatabase;
    const collectionName = params.collection;
    const collectionOptions = params.options;

    if (!db.databaseSelected(databaseName, callback)) {
        return;
    }

    db.collections[`${databaseName}.${collectionName}`] = db.dbs[databaseName].addCollection(collectionName, collectionOptions);
    callback(null, db.collections[`${databaseName}.${collectionName}`]);
}

module.exports = new method.Method(descriptor, handler);
