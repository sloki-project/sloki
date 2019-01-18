const log = require('evillogger')({ns:'commands'});

/**
 * client disconnect
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
     callback(null, "bye");
     this.end();
}

module.exports = quit;
