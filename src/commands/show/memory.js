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

    if (options.socket) {

        if (options.socket.getOutputFormat() === "json") {
            options.socket.write(used,{prompt:true});
            callback && callback();
            return;
        }

        if (options.socket.getOutputFormat() === "text") {
            for (let key in used) {
                options.socket.write(
                    sprintf("%-10s %10s", key, prettyBytes(used[key])),
                    {prompt:key==="external"}
                );
            }
            callback && callback();
            return;
        }

    }

    callback && callback();

}

module.exports = showMemoryUsage;
