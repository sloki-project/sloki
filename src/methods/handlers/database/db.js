const method = require('../../method');

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
function handler(params, context, callback) {
    callback(null, context.session.loki.currentDatabase);
}


module.exports = new method.Method(descriptor, handler);
