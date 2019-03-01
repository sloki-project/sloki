const handler = require('../../handler');

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
function handle(params, context, callback) {
    callback(null, Object.keys(context.server.clients));
}

module.exports = new handler.Method(descriptor, handle);
