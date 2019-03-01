const handler = require('../../handler');

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
function handle(params, context, callback) {
    setTimeout(() => {
        callback();
    }, 1000);
}

module.exports = new handler.Method(descriptor, handle);
