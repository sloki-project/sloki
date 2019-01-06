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
    options.socket.write(dbs,{prompt:true})
    callback();
    return;
}

module.exports = showDatabases;
