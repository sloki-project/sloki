const log = require('evillogger')({ns:'commands'});
const ENV = require('../env');
const databases = require('../databases');

/**
 * Client ask for currently selected database
 *
 * @example
 * > db
 * test
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
 function db(params, callback) {

     let errorDatabaseNameMandatory = {
         code: -32602, // invalid param http://jsonrpc.org/spec.html#error_object
         message:"databaseName is mandatory"
     }

     let errorDatabaseNameMatchForbiddenChars = {
         code: -32602, // invalid param http://jsonrpc.org/spec.html#error_object
         message:"databaseName should only contains alphanumeric chars"
     }

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

module.exports = db;
