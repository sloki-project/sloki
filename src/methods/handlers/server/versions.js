const Method = require('../../Method');
const slokiVersion = require('../../../../package.json').version;
const lokijsVersion = require('../../../../node_modules/lokijs/package.json').version;

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
function handler(params, session, callback) {
    callback(null, {
        sloki:slokiVersion,
        lokijs:lokijsVersion
    });
}

module.exports = new Method(descriptor, handler);
