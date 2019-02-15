const Method = require('../../Method');

const descriptor = {
    title:'methods',
    description:'Return methods list'
};

/**
* return available commands
*
* @example
* > methods
* ['method1','method2', ...]
* ...
*
* @param {object} params - not used
* @param {function} callback - callback
* @memberof Commands
*/
function handler(params, callback) {
    callback(null, require('../../').listWithDescriptor());
}

module.exports = new Method(descriptor, handler);
