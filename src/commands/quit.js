const log = require('evillogger')({ns:'commands'});
const ENV = require('../env');

/**
 * Client ask want to quit
 *
 * @example
 * > quit
 * bye
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
 function quit(params, callback) {
     callback(null,"bye");
     this.end();
}

module.exports = quit;
