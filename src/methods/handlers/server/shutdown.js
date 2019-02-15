const Method = require('../../Method');


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
function handler(params, callback) {
    require('../../../server').stop();
    callback();
}

module.exports = new Method(descriptor, handler);
