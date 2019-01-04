/**
 * Client ask for disconnect
 *
 * @example
 * client> quit
 * server> bye
 *
 * @param {object} options - options.command, options.params. options.socket
 * @param {function} callback - callback
 * @memberof Commands
 */
 function quit(options, callback) {
     options.socket.write("bye\n");
     options.socket.end();
     callback();
}

module.exports = quit;
