const method = require('../../method');


const descriptor = {
    title:'shutdown',
    description:'Shutdown sloki server'
};

/**
 * Client ask for server shutdown
 *
 * @example
 * > shutdown
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, context, callback) {
    require('../../../server').stop();
    callback();
}

module.exports = new method.Method(descriptor, handler);
