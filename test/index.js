const log = require('evillogger')({ns:'tests'});
const server = require('../src/server');
const klawSync = require('klaw-sync');
const path = require('path');
const async = require('async');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const ENV = require('../src/env');

// @FIXME: deal with local server vs test server
// working on local computer or travis.ci tests ?
const USE_TEST_SERVER = process.env.LOGNAME!="franck";

let tests = {};
let testName;
let dir;
let testFailed = false;

function prepareTests() {
    for (let file of klawSync(__dirname,{depthLimit:1, nodir:true})) {

        if (file.path.match(/\/index|\/tap|\/endpoint/)) {
            // ignore myself (index.js)
            // or directories having /commands/mycommand/index.js
            continue;
        }

        if (!file.path.match(/\.js$/)) {
            // ignore other than js files
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
    for (let file of klawSync(ENV.DATABASES_DIRECTORY,{depthLimit:0})) {
        if (path.basename(file.path).match(/\_\_/)) {
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

    async.mapSeries(
        tests,
        (test, next) => {
            let s = spawn(
                'node',
                [
                    'node_modules/tap/bin/run.js',
                    '--reporter='+reporter,
                    test
                ],
                {stdio:'inherit'}
            );

            s.on('close', (code) => {
                if (code != 0) testFailed = true;
                next();
            })
        },
        () => {
            if (USE_TEST_SERVER) {
                server.stop(endTests);
            } else {
                endTests();
            }
        }
    );
}


if (USE_TEST_SERVER) {
    server.start((err) => {
        if (err) {
            throw new Error(err);
            process.exit();
        }
        setTimeout(runTests,1000);
    });
} else {
    runTests();
}
