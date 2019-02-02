const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"remove",
    categories:["collection"],
    description:{
        short:"Remove a document by id"
    },
    parameters:[
        {
            name:"Collection name",
            mandatory:true,
            description:"Collection name",
            sanityCheck:{
                type:"string",
                reString:require('../regexps').collectionName,
                reFlag:"i"
            }
        },
        {
            name:"document or document id",
            mandatory:true,
            description:"Document or document ID",
            sanityCheck:{
                type:["number","object"]
            }
        }
    ]
}

/**
 * remove a document in specified collection
 *
 * @example
 * client> remove myCollection 1
 * { ... }
 *
 * @param {object} params - array[collectionName, id]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    databases.remove(
        socket.loki.currentDatabase,
        params[0], // collection name
        params[1], // document
        callback
    )
}

module.exports = new Command(descriptor, handler);
