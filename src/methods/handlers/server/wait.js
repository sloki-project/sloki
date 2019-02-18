const Method = require('../../Method');

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
function handler(params, session, callback) {
    setTimeout(() => {
        callback();
    }, 1000);
}

module.exports = new Method(descriptor, handler);
