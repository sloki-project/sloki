const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'saveDatabase',
    categories:['database'],
    description:{
        short:'Force save of currently selected database',
    },
    parameters:[]
};


/**
 * save selected database
 *
 * @example
 * > saveDatabase
 * test
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handler(params, callback, socket) {
    const databaseName = socket.loki.currentDatabase;

    if (!shared.databaseSelected(databaseName, callback)) {
        return;
    }

    shared.dbs[databaseName].saveDatabase((err) => {
        if (err) {
            callback({
                code: shared.ERROR_CODE_INTERNAL,
                message: err.message
            });
            return;
        }

        callback();
    });
}

module.exports = new Method(descriptor, handler);
