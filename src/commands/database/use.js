const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"use",
    categories:["database"],
    description:{
        short:"Select a database (if not exist, a new db will be created)"
    },
    parameters:[
        {
            name:"database name",
            mandatory:true,
            mandatoryError:"Database name is mandatory",
            description:"Database name",
            sanityCheck:{
                type:"string",
                reString:"^[a-z0-9\-\.\_]{1,50}$",
                reFlag:"i",
            }
        }
    ]
}

/**
 * return selected database name
 *
 * @example
 * > use test
 * test
 *
 * @param {object} params - ['databaseName']
 * @param {function} callback - callback
 * @memberof Commands
 */
 function handler(params, callback, socket) {

     let databaseName = params[0];

     databases.use(databaseName, (err) => {
         socket.loki.currentDatabase = databaseName;
         callback(null, socket.loki.currentDatabase);
     })
}

module.exports = new Command(descriptor, handler);
