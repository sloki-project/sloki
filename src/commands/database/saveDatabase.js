const Command = require('../Command');
const databases = require('../../databases');

let descriptor = {
    name:"saveDatabase",
    categories:["database"],
    description:{
        short:"Force save of currently selected database",
    },
    parameters:[]
}


/**
 * save selected database
 *
 * @example
 * > saveDatabase
 * test
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
 function handler(params, callback, socket) {
     databases.saveDatabase(socket.loki.currentDatabase, (err) => {
         callback(err, socket.loki.currentDatabase);
     })
}

module.exports = new Command(descriptor, handler);
