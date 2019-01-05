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
         let i = dbs.length;
         while (i--) {
             options.socket.write(dbs[i]+ENV.NET_TCP_EOF);
         }
         options.socket.write(ENV.NET_TCP_PROMPT);
         return;
     }
     callback(new Error('missing or bad parameters (dbs)'));
}

module.exports = show;
