const ENV = require('../env');

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
 function quit(options, callback) {
     options.socket.write(options.socket.loky.currentDatabase+ENV.NET_TCP_EOF);
     callback();
}

module.exports = quit;
