const Method = require('../../Method');

const descriptor = {
    name:'db',
    categories:['database'],
    description:{
        short:'Return currently selected database name',
    },
    parameters:[]
};

/**
 * return currently selected database
 *
 * @example
 * > db
 * test
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    callback(null, socket.loki.currentDatabase);
}


module.exports = new Method(descriptor, handler);
