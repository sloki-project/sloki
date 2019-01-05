const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');
const databases = require('../../databases');

/**
 * Client ask for databases list
 *
 * @example
 * client> show dbs
 * server> BYE
 *
 * @param {object} options - options.command, options.params. options.socket
 * @param {function} callback - callback
 * @memberof Commands
 */
function showDatabases(options, callback) {
     let dbs = databases.listSync();
     let i = dbs.length;
     while (i--) {
         options.socket.write(dbs[i]+ENV.NET_TCP_EOF);
     }
     options.socket.write(ENV.NET_TCP_PROMPT);
     callback && callback();
 }

module.exports = showDatabases;
