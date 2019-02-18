const log = require('evillogger')({ ns:'loki' });
const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const loki = require('lokijs');

const config = require('./config');
const shared = require('./methods/shared');

function initialize() {

    if (!fs.pathExistsSync(config.DATABASES_DIRECTORY)) {
        fs.ensureDirSync(config.DATABASES_DIRECTORY);
        log.info('Directory %s created', config.DATABASES_DIRECTORY);
    }

    let dbName;
    let file;

    for (file of klawSync(config.DATABASES_DIRECTORY)) {
        dbName = path.basename(file.path).replace(/\.json/, '');
        log.info(`Loading database ${file.path}`);
        shared.dbs[dbName] = new loki(file.path, shared.DEFAULT_DATABASE_OPTIONS);
    }

    const dbTestFile = path.resolve(config.DATABASES_DIRECTORY+'/test.json');

    if (!shared.dbs['test']) {
        shared.dbs['test'] = new loki(dbTestFile, shared.DEFAULT_DATABASE_OPTIONS);
        shared.dbs['test'].save();
    }
}

module.exports = {
    initialize
};
