const log = require('evillogger')({ ns:'tests' });
const server = require('../src/server');
const klawSync = require('klaw-sync');
const path = require('path');
const async = require('async');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const config = require('../src/config');
const homedir = require('os').homedir();

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

function cleanTestDatabases() {
    if (!fs.pathExistsSync(config.DATABASES_DIRECTORY)) {
        return;
    }

    let file;
    for (file of klawSync(config.DATABASES_DIRECTORY, { depthLimit:0 })) {
        if (path.basename(file.path).match(/\_\_/)) {
            console.log('removing', file.path);
            fs.removeSync(file.path);
        }
    }
}


function runTests(engine, done) {
    prepareTests();


    // available reporters:
    // classic doc dot dump json jsonstream
    // landing list markdown min nyan progress
    // silent spec tap xunit

    const reporter = 'spec';

    const optionTap = [
        path.resolve('./node_modules/tap/bin/run.js'),
        '--reporter='+reporter
    ];

    const optionTape = [
        path.resolve('./node_modules/tape/bin/tape')
    ];

    const tester = 'tape'; // or tap

    async.mapSeries(
        tests,
        (test, next) => {
            let args;
            if (tester === 'tape') {
                args = JSON.parse(JSON.stringify(optionTape));
            } else {
                args = JSON.parse(JSON.stringify(optionTap));
            }
            args.push(test);

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
        () => {
            server.stop(done);
        }
    );
}

const options = {
    DATABASES_DIRECTORY:path.resolve(homedir+'/.slokitest/dbs'),
    NET_TCP_PORT:6371,
    MEM_LIMIT:40 // in Mb
};

async.series([
    (next) => {
        cleanTestDatabases();
        options.NET_TCP_ENGINE = 'binary';
        server.start(options, (err) => {
            if (err) {
                throw new Error(err);
            }
            runTests(options.NET_TCP_ENGINE, next);
        });
    },
    (next) => {
        cleanTestDatabases();
        options.NET_TCP_ENGINE = 'jsonrpc';
        server.start(options, (err) => {
            if (err) {
                throw new Error(err);
            }
            runTests(options.NET_TCP_ENGINE, next);
        });
    }
], () => {
    process.exit();
});
