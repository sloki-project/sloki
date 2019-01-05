const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');

/**
 * Client ask for currently selected database
 *
 * @example
 * > db
 * test
 *
 * @param {object} options - options.command, options.params. options.socket
 * @param {function} callback - callback
 * @memberof Commands
 */
 function db(options, callback) {
     options.socket.write(options.socket.loky.currentDatabase+ENV.NET_TCP_EOF);
     options.socket.write(ENV.NET_TCP_PROMPT);
     callback();
}

module.exports = db;
