const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');
const databases = require('../../databases');
const prettyBytes = require('pretty-bytes');
const sprintf = require('sprintf-js').sprintf;

/**
* Client ask for memory usage
*
* @example
* > show memory
* rss           24.7 MB
* heapTotal     12.8 MB
* heapUsed      7.36 MB
* external       292 kB*
* @param {object} options - options.command, options.params. options.socket
* @param {function} callback - callback
* @memberof Commands
*/
function showMemoryUsage(options, callback) {
    let used = process.memoryUsage();
    for (let key in used) {
        options.socket.write(
            sprintf(
                "%-10s %10s %s",
                key,
                prettyBytes(used[key]),
                ENV.NET_TCP_EOF
            )
        );
    }
    options.socket.write(ENV.NET_TCP_PROMPT);
    callback && callback();
}

module.exports = showMemoryUsage;
