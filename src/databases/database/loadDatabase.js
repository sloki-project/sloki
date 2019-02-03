const path = require('path');
const shared = require('../shared');
const constants = require('../constants');
const ENV = require('../../env');
const loki = require('lokijs');

function loadDatabase(databaseName, databaseOptions, callback) {

    if (shared.dbs[databaseName]) {
        callback(null, shared.dbs[databaseName]);
        return;
    }

    if (typeof databaseOptions === 'function') {
        callback = databaseOptions;
        databaseOptions = {};
    }

    const dbPath = path.resolve(ENV.DATABASES_DIRECTORY+`/${databaseName}.json`);
    const options = Object.assign(constants.DEFAULT_DATABASE_OPTIONS, databaseOptions||{});

    options.autoloadCallback = () => {
        callback(null, shared.dbs[databaseName]);
    };

    shared.dbs[databaseName] = new loki(dbPath, options);

    // by default, immediate save (force flush) after creating database
    ENV.DATABASES_FORCE_SAVE_ON_CREATE && shared.dbs[databaseName].save();
}

module.exports = loadDatabase;
