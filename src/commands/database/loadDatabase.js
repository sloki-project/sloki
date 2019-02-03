const Command = require('../Command');
const databases = require('../../databases');

const descriptor = {
    name:'use',
    categories:['database'],
    description:{
        short:'Select a database (if not exist, a new db will be created)'
    },
    parameters:[
        {
            name:'database name',
            mandatory:true,
            mandatoryError:'Database name is mandatory',
            description:'Database name',
            sanityCheck:{
                type:'string',
                reString:'^[a-z0-9\-\.\_]{1,50}$',
                reFlag:'i',
            }
        },
        {
            name:'Options',
            mandatory:false,
            description:'Database options',
            sanityCheck:{
                type:'object'
            }
        }
    ]
};

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
    databases.loadDatabase(
        params[0], // database name
        params[1], // database options
        (err, database) => {
            socket.loki.currentDatabase = params[0];
            callback(null, database);
        }
    );
}

module.exports = new Command(descriptor, handler);
