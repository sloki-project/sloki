const Command = require('../Command');


const descriptor = {
    name:'shutdown',
    categories:['server'],
    description:{
        short:'Shutdown sloki server',
    },
    parameters:[]
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
    require('../../server').stop();
    callback();
}

module.exports = new Command(descriptor, handler);
