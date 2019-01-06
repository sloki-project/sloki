const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');

/**
 * Client ask for disconnect
 *
 * @example
 * > quit
 * bye
 *
 * @param {object} options - options.command, options.params. options.socket
 * @param {function} callback - callback
 * @memberof Commands
 */
 function quit(options, callback) {
     options.socket.write("bye",{end:true});
     callback();
}

module.exports = quit;
