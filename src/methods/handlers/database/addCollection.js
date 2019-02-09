const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'addCollection',
    categories:['database'],
    description:{
        short:'Add a collection into currently selected database'
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
            name:'Options',
            mandatory:false,
            description:'Collection options',
            sanityCheck:{
                type:'object'
            }
        }
    ]
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
    const collectionName = params[0];
    const collectionOptions = params[1];

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    shared.collections[`${databaseName}.${collectionName}`] = shared.dbs[databaseName].addCollection(collectionName, collectionOptions);
    callback(null, shared.collections[`${databaseName}.${collectionName}`]);
}

module.exports = new Method(descriptor, handler);
