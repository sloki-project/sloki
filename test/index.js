const log = require('evillogger')({ns:'tests'});
const server = require('../src/server');
const klawSync = require('klaw-sync');
const path = require('path');
const async = require('async');
const spawnSync = require('child_process').spawnSync;

const USE_LOCAL_SERVER = true;

let tests = {};
let testName;
let dir;

function prepareTests() {
    for (let file of klawSync(__dirname,{depthLimit:1, nodir:true})) {

        if (file.path.match(/\/index|\/tap/)) {
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
            let s = spawnSync(
                'node',
                [
                    'node_modules/tap/bin/run.js',
                    '--reporter='+reporter,
                    test
                ],
                {stdio:'inherit'}
            );

            next();
        },
        () => {
            if (USE_LOCAL_SERVER) {
                server.stop(process.exit);
            } else {
                process.exit();
            }
        }
    );
}


if (USE_LOCAL_SERVER) {
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
