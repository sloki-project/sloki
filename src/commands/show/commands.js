const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

/**
* Client ask for commands list
*
* @example
* > showCommands
* command1
* command2
* ...
*
* @param {object} params - not used
* @param {function} callback - callback
* @memberof Commands
*/
function showCommands(params, callback) {
    callback(null, Object.keys(require('../').list));
}

module.exports = showCommands;
