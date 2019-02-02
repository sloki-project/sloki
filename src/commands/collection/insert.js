const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"insert",
    categories:["collection"],
    description:{
        short:"Add a document"
    },
    parameters:[
        {
            name:"Collection name",
            mandatory:true,
            description:"Collection name",
            sanityCheck:{
                type:"string",
                reString:"^[a-z0-9\-\.\_]{1,50}$",
                reFlag:"i"
            }
        },
        {
            name:"Document",
            mandatory:true,
            description:"Document",
            sanityCheck:{
                type:"object"
            }
        }
    ]
}

/**
 * insert a record in a collection
 *
 * @example
 * client> insert myCollection {"foo":"bar"}
 * 2
 *
 * @param {object} params - array[collectionName, record]
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    databases.insert(
        socket.loki.currentDatabase,
        params[0], // collection name
        params[1], // record
        (err, id) => {
            callback(err, id);
        }
    )
}

module.exports = new Command(descriptor, handler);
