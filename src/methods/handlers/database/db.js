const Method = require('../../Method');

const descriptor = {
    title:'db',
    description:'Return currently selected database name'
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
