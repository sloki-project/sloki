const method = require('../../method');

const descriptor = {
    title:'wait',
    description:'Wait for one sec'
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
function handler(params, context, callback) {
    setTimeout(() => {
        callback();
    }, 1000);
}

module.exports = new method.Method(descriptor, handler);
