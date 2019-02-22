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
    if (!fs.pathExistsSync(config.SLOKI_DIR_DBS)) {
        return;
    }

    let file;
    for (file of klawSync(config.SLOKI_DIR_DBS, { depthLimit:0 })) {
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

            process.env.SLOKI_SERVER_ENGINE = engine;

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

const options = {
    SLOKI_DIR:path.resolve(homedir+'/.slokitest'),
    MEM_LIMIT:62        // in Mb
};

if (process.version.match(/v9/)) {
    options.MEM_LIMIT = 36;
}

server.start(options, (err) => {
    if (err) {
        throw new Error(err);
    }

    async.series([
        (next) => {
            cleanTestDatabases();
            runTests('tcpbinary', next);
        },
        (next) => {
            cleanTestDatabases();
            runTests('tlsbinary', next);
        },
        (next) => {
            cleanTestDatabases();
            runTests('tcpjsonrpc', next);
        },
        (next) => {
            cleanTestDatabases();
            runTests('tlsjsonrpc', next);
        },
        (next) => {
            server.stop(next);
        }
    ], () => {
        process.exit();
    });
});
