const log = require('evillogger')({ ns:'tests' });
const klawSync = require('klaw-sync');
const path = require('path');
const async = require('async');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const homedir = require('os').homedir();
const server = require('../').server;

const options = {
    SLOKI_DIR:path.resolve(homedir+'/.slokitest'),
    SLOKI_DIR_DBS:path.resolve(homedir+'/.slokitest/dbs'),
    MEM_LIMIT:62        // in Mb
};

const tests = {};

let testName;
let dir;

function prepareTests() {
    let file;
    for (file of klawSync(__dirname, { depthLimit:1, nodir:true })) {

        if (!file.path.match(/[0-9]{3}/)) {
            continue;
        }

        testName = path.basename(file.path).replace(/\.js/, '');
        dir = path.dirname(file.path).split('/');
        dir = dir[dir.length-1];
        testName = dir+'/'+testName;
        tests[testName] = file.path;
        log.info(`Test registered (${testName})`);
    }
}

function cleanTestDatabases(callback) {
    if (!fs.pathExistsSync(options.SLOKI_DIR_DBS)) {
        if (callback) {
            callback();
        }
        return;
    }

    let file;
    const files = klawSync(options.SLOKI_DIR_DBS, { depthLimit:0 });
    for (file of files) {
        if (path.basename(file.path).match(/^\_\_/)) {
            fs.removeSync(file.path);
            console.log(`removed ${file.path}`);
        }
    }
    if (callback) {
        callback();
    }
}


function runTests(engine, done) {

    prepareTests();

    async.mapSeries(
        tests,
        (test, next) => {

            process.env.SLOKI_SERVER_ENGINE = engine;

            const args = [
                path.resolve('./node_modules/tape/bin/tape'),
                test
            ];

            const opts = {
                stdio:'inherit',
                env:process.env
            };

            const s = spawn('node', args, opts);

            s.on('close', (code) => {
                if (code != 0) {
                    process.exit(255);
                }
                next();
            });

            s.on('error', (err) => {
                console.log(err);
                process.exit(255);
            });
        },
        done
    );
}

function startServer(callback) {
    server.start(options, (err) => {
        if (err) {
            throw new Error(err);
        }
        callback();
    });
}

function stopServer(callback) {
    server.stop(callback);
}

function binarys(callback) {
    runTests('binarys', callback);
}

function jsonrpcs(callback) {
    runTests('jsonrpcs', callback);
}

function dinary(callback) {
    runTests('dinarys', callback);
}

async.series([
    cleanTestDatabases,
    startServer,
    binarys,
    jsonrpcs,
    dinary,
    stopServer
], () => {
    process.exit();
});
