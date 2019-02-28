const method = require('../../method');
const slokiVersion = require('../../../../package.json').version;
const lokijsVersion = require(process.cwd()+'/node_modules/lokijs/package.json').version;

const descriptor = {
    title:'version',
    description:'Return sloki and lokijs version'
};

/**
 * just wait a sec
 *
 * @example
 * > wait
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, context, callback) {
    callback(null, {
        sloki:slokiVersion,
        lokijs:lokijsVersion
    });
}

module.exports = new method.Method(descriptor, handler);
