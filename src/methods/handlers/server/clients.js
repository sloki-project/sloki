const Method = require('../../Method');

const descriptor = {
    name:'clients',
    categories:['server'],
    description:{
        short:'Return connected clients list'
    }
};

/**
 * return TCP/TLS connected clients
 *
 * @example
 * > clients
 * ['127.0.0.1:1379']
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    callback(null, Object.keys(socket.server.clients));
}

module.exports = new Method(descriptor, handler);
