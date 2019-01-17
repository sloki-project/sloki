const log = require('evillogger')({ns:'commands'});
const ENV = require('../env');
const databases = require('../databases');

let errorDatabaseNameMandatory = {
    code: -32602, // invalid param http://jsonrpc.org/spec.html#error_object
    message:"databaseName is mandatory"
}

let errorDatabaseNameMatchForbiddenChars = {
    code: -32602, // invalid param http://jsonrpc.org/spec.html#error_object
    message:"databaseName should only contains alphanumeric chars"
}

/**
 * return selected database name
 *
 * @example
 * > use test
 * test
 *
 * @param {object} params - ['databaseName']
 * @param {function} callback - callback
 * @memberof Commands
 */
 function use(params, callback) {

     if (!params) {
         callback(errorDatabaseNameMandatory);
         return;
     }

     let databaseName = params[0];
     if (!databaseName) {
         callback(errorDatabaseNameMandatory);
         return;
     }

     if (!databaseName.match(/^[\_\-a-z0-9]{1,100}$/i)) {
         callback(errorDatabaseNameMatchForbiddenChars);
         return;
     }

     databases.use(databaseName, (err) => {
         this.loki.currentDatabase = databaseName;
         callback(null, this.loki.currentDatabase);
     })
}

module.exports = use;
