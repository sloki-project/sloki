const log = require('evillogger')({ns:'commands'});

/**
* return available commands
*
* @example
* > commands
* command1
* command2
* ...
*
* @param {object} params - not used
* @param {function} callback - callback
* @memberof Commands
*/
function commands(params, callback) {
    callback(null, Object.keys(require('../').list));
}

module.exports = commands;
