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
function handler(params, session, callback) {
    callback(null, session.loki.currentDatabase);
}


module.exports = new Method(descriptor, handler);
