const Command = require('../Command');
const databases = require('../../databases');

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
                reString:require('../regexps').collectionName,
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
    databases.find(
        socket.loki.currentDatabase,
        params[0], // collection name
        params[1], // filters
        callback
    );
}

module.exports = new Command(descriptor, handler);
