const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const databases = require('../../databases');

let errorCollectionNameMandatory = {
    code: -32602, // invalid param http://jsonrpc.org/spec.html#error_object
    message:"collectionName is mandatory"
}

/**
 * add a collection in selected database
 *
 * @example
 * client> addCollection myCollection
 * myCollection
 *
 * @param {object} params - array['collectionName', options]
 * @param {function} callback - callback
 * @memberof Commands
 */
function addCollection(params, callback) {
    if (!params) {
        callback(errorCollectionNameMandatory);
        return;
    }

    let collectionName = params[0];
    if (!collectionName) {
        callback(errorCollectionNameMandatory);
        return;
    }

    callback(null, databases.addCollection(this.loki.currentDatabase, params[0], params[1]));
}

module.exports = addCollection;
