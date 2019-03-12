const async = require('async');
const Client = require('./lib/client');
const klawSync = require('klaw-sync');
const path = require('path');
const os = require('os');
const slokiVersion = require('../package.json').version;
const sprintf = require('sprintf-js').sprintf;
const argv = require('minimist')(process.argv.slice(2));
const prettyMs = require('pretty-ms');
const si = require('systeminformation');

const clients = {};
const tests = {};
const results = {};
const host = 'localhost';
const dbName = '__bench';
const lineLen = 80;

let protocols = [
    'binary',
    'binarys',
    'jsonrpc',
    'jsonrpcs',
    'dinary',
    'dinarys'
];

if (argv.protocol) {
    protocols = [argv.protocol];
}

function onClientError(err) {
    console.log(err);
    process.exit();
}

function clientsConnect(callback) {
    async.eachSeries(
        protocols,
        (protocol, next) => {
            clients[protocol] = new Client(`${protocol}://${host}`);
            clients[protocol].on('error', onClientError);
            try {
                (async () => {
                    await clients[protocol].connect();
                    console.log(`> client connected (${protocol})`);
                    await clients[protocol].loadDatabase({ db:dbName, o:{ autosave:false } }, (next));
                })();
            } catch (e) {
                throw e;
            }
        },
        callback
    );
}

function clientsDisconnect(callback) {
    async.eachSeries(
        clients,
        (client, next) => {
            client.close(() => {
                console.log(`> client disconnected (${client.protocol})`);
                next();
            });
        },
        callback
    );
}

function prepareTests(callback) {
    let file;
    for (file of klawSync(__dirname+'/tests', { depthLimit:0, nodir:true })) {
        const testName = path.basename(file.path).replace(/\.js/, '');
        tests[testName] = require(file.path);
    }
    callback();
}

function runTest(test, client, callback) {
    const str = `${test.title}@${client.protocol}`;
    console.log(sprintf('%-50s', `> run ${str}`));
    try {
        test.bench(client, () => {
            results[str] = {
                operationsPerSecond:test.operationsPerSecond,
                operationsCount:test.operationsCount,
                timeElapsed:prettyMs(test.timeElapsed)
            };
            callback();
        });
    } catch(e) {
        throw e;
    }
}

function runClientsTest(test, callback) {
    console.log('>'.repeat(5), 'test', test.title);
    async.eachSeries(
        clients,
        (client, next) => {
            runTest(test, client, next);
        },
        callback
    );
}

function resetMemory(callback) {
    if (argv.nogc) {
        callback();
        return;
    }

    const client = clients[argv.protocol || 'dinarys'];

    async.series([
        (next) => {
            client.removeCollection({ c:'i' }, (err, result) => {
                if (err) throw err;
                console.log('removed', result);
                next();
            });
        },
        (next) => {
            client.gc((err, result) => {
                if (err) {
                    throw err;
                }
                console.log('>'.repeat(5), `gc done (rss before ${result.before.rss}, after ${result.after.rss})`);
                next();
            });
        }
    ], callback);
}

function runAllTests(callback) {
    async.series([
        (next) => {
            async.eachSeries(
                tests,
                runClientsTest,
                next
            );
        },
        resetMemory
    ], callback);
}

function report() {
    console.log();
    console.log('#', '-'.repeat(lineLen));

    console.log(sprintf('# %-40s | %10s | %7s | %7s', 'Test', 'Operations', 'ops/sec', 'exec time'));

    console.log('#', '-'.repeat(lineLen));

    async.eachSeries(
        tests,
        (test, next) => {
            async.eachSeries(
                clients,
                (client, next) => {
                    const str = `${test.title}@${client.protocol}`;
                    console.log(sprintf(
                        '# %-40s | %10s | %7s | %7s',
                        test.title+'@'+client.protocol,
                        results[str].operationsCount,
                        results[str].operationsPerSecond,
                        results[str].timeElapsed
                    ));
                    next();
                },
                next
            );
        },
        () => {
            console.log();
        }
    );
}

function run() {

    si.cpu((cpuInfo) => {


        console.log('#'.repeat(lineLen+1));
        console.log(`# Benchmark suite using sloki v${slokiVersion}    ${cpuInfo.manufacturer} ${cpuInfo.brand} ${cpuInfo.speed}Ghz`);
        console.log('#'.repeat(lineLen+1));
        console.log(`# ${os.arch()} | ${os.cpus().length} CPU(s) | ${os.platform()} (${os.release()} ${os.type}) | node ${process.version}`);
        console.log('#'.repeat(lineLen+1));

        async.series([
            prepareTests,
            clientsConnect,
            runAllTests,
            clientsDisconnect
        ], report);
    });
}

run();
