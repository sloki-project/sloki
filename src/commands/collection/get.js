const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"get",
    categories:["collection"],
    description:{
        short:"Get a document by id"
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
            name:"Unique ID",
            mandatory:true,
            description:"Loki id",
            sanityCheck:{
                type:"number"
            }
        }
    ]
}

/**
 * get a document by his loki id
 *
 * @example
 * client> get myCollection 1
 * { ... }
 *
 * @param {object} params - array[collectionName, id]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    databases.get(
        socket.loki.currentDatabase,
        params[0],
        params[1],
        (err, id) => {
            callback(err, id);
        }
    )
}

module.exports = new Command(descriptor, handler);
