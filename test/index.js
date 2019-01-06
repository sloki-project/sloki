const log = require('evillogger')({ns:'tests'});
const tap = require('tap');
const server = require('../');
const klawSync = require('klaw-sync');
const path = require('path');
const async = require('async');

let tests = {};

function prepareTests() {
    for (let file of klawSync(__dirname,{depthLimit:1, nodir:true})) {

        if (file.path.match(/\/index/)) {
            // ignore myself (index.js)
            // or directories having /commands/mycommand/index.js
            continue;
        }

        let testName = path.basename(file.path).replace(/\.js/,'');
        let dir = path.dirname(file.path).split('/');
        dir = dir[dir.length-1];
        testName = dir+'/'+testName;
        tests[testName] = require(file.path);
        log.info("Test '%s' registered", testName);
    }
}

function runTests() {
    async.mapSeries(
        tests,
        (test, next) => {test.run(next)},
        () => {
            setTimeout(server.stop, 1000);
        }
    );
}

server.start((err) => {
    if (err) {
        log.error(err);
        process.exit(1);
    }
    prepareTests();
    runTests();
});
