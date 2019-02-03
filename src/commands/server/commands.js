const Command = require('../Command');


const descriptor = {
    name:'commands',
    categories:['server'],
    description:{
        short:'Return commands list',
    },
    parameters:[]
};

/**
* return available commands
*
* @example
* > commands
* ['command1','command2', ...]
* ...
*
* @param {object} params - not used
* @param {function} callback - callback
* @memberof Commands
*/
function handler(params, callback) {
    callback(null, require('../').listWithDescriptor());
}

module.exports = new Command(descriptor, handler);
