const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"getCollection",
    categories:["database"],
    description:{
        short:"Return collection properties",
    },
    parameters:[
        {
            name:"Collection name",
            mandatory:true,
            description:"Collection name",
            sanityCheck:{
                type:"string",
                reString:"^[a-z0-9\-\.]{1,50}$",
                reFlag:"i"
            }
        }
    ]
}

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
    callback(null, databases.getCollection(socket.loki.currentDatabase, params[0]));
}


module.exports = new Command(descriptor, handler);
