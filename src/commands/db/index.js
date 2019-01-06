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
     options.socket.write(options.socket.loki.currentDatabase,{prompt:true});
     callback();
}

module.exports = db;
