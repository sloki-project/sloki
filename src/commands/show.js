const ENV = require('../env');
const databases = require('../databases');

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
 function show(options, callback) {
     if (options.params === 'dbs') {
         let dbs = databases.listSync();
         options.socket.write(JSON.stringify({result:dbs})+ENV.NET_TCP_EOF);
         return;
     }
     callback(new Error('missing or bad parameters (dbs)'));
}

module.exports = show;
