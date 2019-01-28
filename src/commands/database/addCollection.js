const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"addCollection",
    categories:["database"],
    description:{
        short:"Add a collection into currently selected database"
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
            name:"Options",
            mandatory:false,
            description:"Collection options",
            sanityCheck:{
                type:"object"
            }
        }
    ]
}

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
    callback(null, databases.addCollection(socket.loki.currentDatabase, params[0], params[1]));
}

module.exports = new Command(descriptor, handler);
