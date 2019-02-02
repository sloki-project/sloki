const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"listCollections",
    categories:["database"],
    description:{
        short:"Return collections in currently selected database",
    },
    parameters:[]
}

/**
 * return collections of current selected database
 *
 * @example
 * client> listCollections
 * []
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    databases.listCollections(socket.loki.currentDatabase, callback);
}

module.exports = new Command(descriptor, handler);
