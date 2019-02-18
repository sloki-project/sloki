const Method = require('../../Method');
const prettyBytes = require('pretty-bytes');

const descriptor = {
    title:'memory',
    description:'Return sloki process memory usage'
};


/**
* return memory usage
*
* @example
* > memory
* {"rss":"24.7 MB", "heapTotal":"12.8 MB", "heapUsed":"7.36 MB", "external":"292 kB*}
* @param {object} params - not used
* @param {function} callback - callback
* @memberof Commands
*/
function handler(params, session, callback) {
    const used = process.memoryUsage();
    for (const key in used) {
        used[key] = prettyBytes(used[key]);
    }

    callback(null, used);
}

module.exports = new Method(descriptor, handler);
