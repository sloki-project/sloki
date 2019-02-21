const log = require('evillogger')({ ns:'server' });
const loki = require('./loki');
const tcpBinaryServer = require('./transports/tcp/binary');
const tcpJsonRpcServer = require('./transports/tcp/jsonrpc');
const prettyBytes = require('pretty-bytes');
const async = require('async');

let config = require('./config');
let closing = false;
let running = false;
let timerMemoryAlert;

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

    async.series([
        tcpBinaryServer.start,
        tcpJsonRpcServer.start
    ], (err) => {
        if (!err) {
            running = true;
            handleSignals();
            loki.initialize();
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
        tcpBinaryServer.stop,
        tcpJsonRpcServer.stop
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

function dumpMemory(level, prefix, mem) {
    log[level](
        '%s rss=%s, allowed %s',
        prefix,
        prettyBytes(mem.rss),
        memLimitBytesHuman(),
    );
}

function memoryAlert() {
    const mem = process.memoryUsage();
    if (mem.rss>memLimitBytes()) {
        if (!config.MEM_LIMIT_REACHED) {
            dumpMemory('warn', 'memory: limit reached', mem);
            config.MEM_LIMIT_REACHED = true;
        } else {
            dumpMemory('warn', 'memory: always above limit', mem);
        }
    } else {
        if (config.MEM_LIMIT_REACHED) {
            dumpMemory('warn', 'memory: back under limit', mem);
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

dumpMemory('info', 'memory:', process.memoryUsage());

module.exports = {
    start,
    stop
};
