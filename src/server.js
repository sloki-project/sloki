const log = require('evillogger')({ ns:'server' });
const path = require('path');
const top = require('process-top')();
const prettyBytes = require('pretty-bytes');
const async = require('async');
const loki = require('./loki');
const binaryServer = require('./protocols/binary');
const jsonRpcServer = require('./protocols/jsonrpc');
const ssl = require('./ssl');

let config = require('./config');
let closing = false;
let running = false;
let timerMemoryAlert;
let tcpBinaryServerInstance;
let tlsBinaryServerInstance;
let tcpJsonRpcServerInstance;
let tlsJsonRpcServerInstance;

const memoryAlertInterval = 1000;

function memLimitBytes() {
    return config.MEM_LIMIT*1024*1024;
}

function memLimitBytesHuman() {
    return prettyBytes(memLimitBytes());
}

function handleSignals() {
    process.on('SIGINT', handleSignalSIGINT);
}

function handleSignalSIGINT() {
    if (closing) {
        log.info('SIGINT received, forcing exit');
        process.exit();
        return;
    }

    closing = true;
    log.info('SIGINT received');
    stop();
}

function start(options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = null;
    }

    // already running !
    if (running) {
        if (callback) {
            callback('ERUNNING');
        }
        return;
    }


    config = Object.assign(config, options||{});
    config.SLOKI_DIR_DBS = path.resolve(config.SLOKI_DIR+'/dbs');

    async.series([
        (next) => {
            ssl.check(next);
        },
        (next) => {
            if (!config.TCP_BINARY_ENABLE) {
                next();
                return;
            }

            tcpBinaryServerInstance = new binaryServer({
                HOST:config.TCP_BINARY_HOST,
                PORT:config.TCP_BINARY_PORT,
                MAX_CLIENTS:config.TCP_BINARY_MAX_CLIENTS,
                SSL:false,
                SHOW_OPS_INTERVAL:config.SHOW_OPS_INTERVAL
            });

            tcpBinaryServerInstance.start(next);
        },
        (next) => {
            if (!config.TLS_BINARY_ENABLE) {
                next();
                return;
            }

            tlsBinaryServerInstance = new binaryServer({
                HOST:config.TLS_BINARY_HOST,
                PORT:config.TLS_BINARY_PORT,
                MAX_CLIENTS:config.TLS_BINARY_MAX_CLIENTS,
                SSL:true,
                SSL_PRIVATE_KEY:config.SSL_PRIVATE_KEY,
                SSL_CERTIFICATE:config.SSL_CERTIFICATE,
                SSL_CA:config.SSL_CA,
                SHOW_OPS_INTERVAL:config.SHOW_OPS_INTERVAL
            });

            tlsBinaryServerInstance.start(next);
        },
        (next) => {
            if (!config.TCP_JSONRPC_ENABLE) {
                next();
                return;
            }

            tcpJsonRpcServerInstance = new jsonRpcServer({
                HOST:config.TCP_JSONRPC_HOST,
                PORT:config.TCP_JSONRPC_PORT,
                MAX_CLIENTS:config.TCP_JSONRPC_MAX_CLIENTS,
                SSL:false,
                SHOW_OPS_INTERVAL:config.SHOW_OPS_INTERVAL
            });

            tcpJsonRpcServerInstance.start(next);
        },
        (next) => {
            if (!config.TLS_JSONRPC_ENABLE) {
                next();
                return;
            }

            tlsJsonRpcServerInstance = new jsonRpcServer({
                HOST:config.TLS_JSONRPC_HOST,
                PORT:config.TLS_JSONRPC_PORT,
                MAX_CLIENTS:config.TLS_JSONRPC_MAX_CLIENTS,
                SSL:true,
                SSL_PRIVATE_KEY:config.SSL_PRIVATE_KEY,
                SSL_CERTIFICATE:config.SSL_CERTIFICATE,
                SSL_CA:config.SSL_CA,
                SHOW_OPS_INTERVAL:config.SHOW_OPS_INTERVAL
            });

            tlsJsonRpcServerInstance.start(next);
        },
        loki.initialize
    ], (err) => {
        if (!err) {
            running = true;
            handleSignals();
            timerMemoryAlert = setInterval(memoryAlert, memoryAlertInterval);
            if (callback) {
                callback();
            }
        }
    });
}

function stop(callback) {
    if (!running) {
        if (callback) {
            callback('ENOTRUNNING');
        }
        return;
    }

    log.warn('shutdown in progress');

    async.series([
        tcpBinaryServerInstance.stop,
        tlsBinaryServerInstance.stop,
        tcpJsonRpcServerInstance.stop,
        tlsJsonRpcServerInstance.stop
    ], (err) => {
        log.warn('bye');
        running = false;
        clearInterval(timerMemoryAlert);
        if (callback) {
            callback(err);
        }
        process.exit();
    });
}

function dumpMemory(level, prefix, rss) {
    log[level](
        '%s rss=%s, allowed %s',
        prefix,
        prettyBytes(rss),
        memLimitBytesHuman(),
    );
}

function memoryAlert() {
    const rss = top.memory().rss;
    if (rss > memLimitBytes()) {
        if (!config.MEM_LIMIT_REACHED) {
            dumpMemory('warn', 'memory: limit reached', rss);
            config.MEM_LIMIT_REACHED = true;
        } else {
            dumpMemory('warn', 'memory: always above limit', rss);
        }
    } else {
        if (config.MEM_LIMIT_REACHED) {
            dumpMemory('warn', 'memory: back under limit', rss);
        }
        config.MEM_LIMIT_REACHED = false;
    }
}


if (global.gc) {
    log.info(`Garbage collector will run every ${config.GC_INTERVAL} ms`);
    setInterval(() => {
        global.gc();
    }, config.GC_INTERVAL);

}

dumpMemory('info', 'memory:', top.memory().rss);

module.exports = {
    start,
    stop
};
