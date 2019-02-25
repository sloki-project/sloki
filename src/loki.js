const log = require('evillogger')({ ns:'loki' });
const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const async = require('async');

const config = require('./config');
const shared = require('./methods/shared');

function initialize(callback) {

    if (!fs.pathExistsSync(config.SLOKI_DIR_DBS)) {
        fs.ensureDirSync(config.SLOKI_DIR_DBS);
        log.info(`directory ${config.SLOKI_DIR_DBS} created`);
    }

    let file;

    log.info(`loading databases from ${config.SLOKI_DIR_DBS}`);

    const dbs = [];

    for (file of klawSync(config.SLOKI_DIR_DBS)) {
        if (file.path.match(/\.(json|db)$/)) {
            dbs.push(path.basename(file.path).replace(/\.(json|db)/, ''));
        }
    }

    if (dbs.indexOf('test')<0) {
        dbs.push('test');
    }

    async.each(dbs, (db, next) => {
        log.info(`loading database ${db}`);
        shared.createDatabase(db, () => {
            log.info(`database ${db} loaded`);
            next();
        });
    }, callback);
}

module.exports = {
    initialize
};
