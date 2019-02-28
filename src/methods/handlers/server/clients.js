const method = require('../../method');

const descriptor = {
    title:'clients',
    description:'Return connected clients list'
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
function handler(params, context, callback) {
    callback(null, Object.keys(context.server.clients));
}

module.exports = new method.Method(descriptor, handler);
