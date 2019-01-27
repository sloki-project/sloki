const log = require('evillogger')({ns:'tests'});
const server = require('../src/server');
const klawSync = require('klaw-sync');
const path = require('path');
const async = require('async');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const ENV = require('../src/env');

let tests = {};
let testName;
let dir;
let testFailed = false;

function prepareTests() {
    for (let file of klawSync(__dirname,{depthLimit:1, nodir:true})) {

        if (!file.path.match(/[0-9]{3}/)) {
            continue;
        }

        testName = path.basename(file.path).replace(/\.js/,'');
        dir = path.dirname(file.path).split('/');
        dir = dir[dir.length-1];
        testName = dir+'/'+testName;
        tests[testName] = file.path;
        log.info("Test registered (%s)", testName);
    }
}

function cleanTestDatabases() {
    if (!fs.pathExistsSync(ENV.DATABASES_DIRECTORY)) {
        return;
    }

    for (let file of klawSync(ENV.DATABASES_DIRECTORY,{depthLimit:0})) {
        if (path.basename(file.path).match(/\_\_/)) {
            console.log('removing ',file.path);
            fs.removeSync(file.path);
        }
    }
}

function endTests() {
    cleanTestDatabases();
    if (testFailed) process.exit(-1);
    process.exit(0);
}

function runTests() {
    prepareTests();


    // available reporters:
    // classic doc dot dump json jsonstream
    // landing list markdown min nyan progress
    // silent spec tap xunit

    let reporter = "spec";

    let optionTap = [
        'node_modules/tap/bin/run.js',
        '--reporter='+reporter
    ];

    let optionTape = [
        'node_modules/tape/bin/tape'
    ];

    let tester = 'tape'; // or tap

    async.mapSeries(
        tests,
        (test, next) => {
            let options;
            if (tester === 'tape') {
                options = JSON.parse(JSON.stringify(optionTape));
            } else {
                options = JSON.parse(JSON.stringify(optionTap));
            }
            options.push(test);

            let s = spawn('node', options, {stdio:'inherit'});

            s.on('close', (code) => {
                if (code != 0) {
                    process.exit(255);
                }
                next();
            })
        },
        () => {
            if (process.env.CI) {
                server.stop(endTests);
            } else {
                endTests();
            }
        }
    );
}

if (process.env.CI) {
    server.start((err) => {
        if (err) {
            throw new Error(err);
            process.exit();
        }
        setTimeout(runTests,1000);
    });
} else {
    cleanTestDatabases();
    runTests();
}
