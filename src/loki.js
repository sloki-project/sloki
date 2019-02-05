const log = require('evillogger')({ ns:'loki' });
const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const loki = require('lokijs');

const ENV = require('./env');
const shared = require('./methods/shared');

function initialize() {

    if (!fs.pathExistsSync(ENV.DATABASES_DIRECTORY)) {
        fs.ensureDirSync(ENV.DATABASES_DIRECTORY);
        log.info('Directory %s created', ENV.DATABASES_DIRECTORY);
    }

    let dbName;
    let file;

    for (file of klawSync(ENV.DATABASES_DIRECTORY)) {
        dbName = path.basename(file.path).replace(/\.json/, '');
        log.info(`Loading database ${file.path}`);
        shared.dbs[dbName] = new loki(file.path, shared.DEFAULT_DATABASE_OPTIONS);
    }

    const dbTestFile = path.resolve(ENV.DATABASES_DIRECTORY+'/test.json');

    if (!shared.dbs['test']) {
        shared.dbs['test'] = new loki(dbTestFile, shared.DEFAULT_DATABASE_OPTIONS);
        shared.dbs['test'].save();
    }
}

module.exports = {
    initialize
};
