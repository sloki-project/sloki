const Method = require('../../Method');

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
function handler(params, session, callback) {
    callback(null, 'bye');
    session.end();
}

module.exports = new Method(descriptor, handler);
