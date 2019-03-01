const handler = require('../../handler');

const descriptor = {
    title:'methods',
    description:'Return handlers list'
};

/**
* return available commands
*
* @example
* > handlers
* ['handler1','handler2', ...]
* ...
*
* @param {object} params - not used
* @param {function} callback - callback
* @memberof Commands
*/
function handle(params, context, callback) {
    callback(null, require('../../').listWithDescriptor());
}

module.exports = new handler.Method(descriptor, handle);
