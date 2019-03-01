const handler = require('../../handler');

const descriptor = {
    title:'quit',
    description:'Disconnect'
};

/**
 * client disconnect
 *
 * @example
 * > quit
 * bye
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handle(params, context, callback) {
    callback(null, 'bye');
    context.session.end();
}

module.exports = new handler.Method(descriptor, handle);
