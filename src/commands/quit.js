const ENV = require('../env');

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
     options.socket.write("bye"+ENV.NET_TCP_EOF);
     options.socket.end();
     callback();
}

module.exports = quit;
