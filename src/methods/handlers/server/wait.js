const Method = require('../../Method');

const descriptor = {
    name:'wait',
    categories:['server'],
    description:{
        short:'Wait for one sec'
    },
    parameters:[]
};

/**
 * just wait a sec
 *
 * @example
 * > wait
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback) {
    setTimeout(() => {
        callback();
    }, 1000);
}

module.exports = new Method(descriptor, handler);
