const log = require('evillogger')({ns:'databases'});
const ENV = require('../env');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const path = require('path');
const loki = require('lokijs');

let dbName;
let dbs = {};

/*
function databaseInitialize() {
    var entries = dbs[this].getCollection("entries");
    if (entries === null) {
        entries = dbs[this].addCollection("entries");
    }

    //entries.insert({name:'Sleipnir', legs: 8})

    let rec = entries.get(1);
    rec.name="franck4";
    entries.update(rec);
    //dbs[dbName].save();
}
*/


if (!fs.pathExistsSync(ENV.DATABASES_DIRECTORY)) {
    fs.ensureDirSync(ENV.DATABASES_DIRECTORY);
    log.info('Directory %s created', ENV.DATABASES_DIRECTORY);
}


for (file of klawSync(ENV.DATABASES_DIRECTORY)) {
    dbName = path.basename(file.path).replace(/\.json/,'');
    log.info("Loading database '%s'", dbName, file.path);

    dbs[dbName] = new loki(file.path, {
    	autoload: true,
    	//autoloadCallback : databaseInitialize.bind(dbName),
    	autosave: true,
    	autosaveInterval: 1000
    });
}

function listSync() {
    let tmp = [];
    for (db of Object.keys(dbs)) {
        tmp.push(db);
    }
    return tmp;
}

module.exports = {
    listSync:listSync
}
