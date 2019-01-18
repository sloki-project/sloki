const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const prettyBytes = require('pretty-bytes');

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
function memory(params, callback) {
    let used = process.memoryUsage();
    for (let key in used) {
        used[key] = prettyBytes(used[key]);
    }

    callback(null, used);
}

module.exports = memory;
