const log = require('evillogger')({ ns:'loki' });
const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const loki = require('lokijs');

const config = require('./config');
const shared = require('./methods/shared');

function initialize() {

    if (!fs.pathExistsSync(config.SLOKI_DIR)) {
        fs.ensureDirSync(config.SLOKI_DIR);
        log.info('Directory %s created', config.SLOKI_DIR);
    }

    let dbName;
    let file;

    for (file of klawSync(config.SLOKI_DIR)) {
        dbName = path.basename(file.path).replace(/\.json/, '');
        log.info(`Loading database ${file.path}`);
        shared.dbs[dbName] = new loki(file.path, shared.DEFAULT_DATABASE_OPTIONS);
    }

    const dbTestFile = path.resolve(config.SLOKI_DIR+'/test.json');

    if (!shared.dbs['test']) {
        shared.dbs['test'] = new loki(dbTestFile, shared.DEFAULT_DATABASE_OPTIONS);
        shared.dbs['test'].save();
    }
}

module.exports = {
    initialize
};
