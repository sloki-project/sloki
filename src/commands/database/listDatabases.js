const Command = require('../Command');
const databases = require('../../databases');

const descriptor = {
    name:'listDatabases',
    categories:['database'],
    description:{
        short:'Return available databases',
    },
    parameters:[]
};

/**
 * return databases list
 *
 * @example
 * client> listDatabases
 * ['test']
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback) {
    callback(null, databases.list());
}

module.exports = new Command(descriptor, handler);
