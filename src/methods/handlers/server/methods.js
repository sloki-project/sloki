const Method = require('../../Method');

const descriptor = {
    name:'methods',
    categories:['server'],
    description:{
        short:'Return methods list',
    },
    parameters:[]
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
