const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'getCollection',
    categories:['database'],
    description:{
        short:'Return collection properties',
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
        }
    ]
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
    const collectionName = params[0];

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    callback(null, shared.dbs[databaseName].getCollection(collectionName));
}


module.exports = new Method(descriptor, handler);
