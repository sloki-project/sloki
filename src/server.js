const log = require('evillogger')({ ns:'server' });
const loki = require('./loki');
const tcpJsonRpc = require('./transports/tcp/jsonrpc');
const tcpBinary = require('./transports/tcp/binary');
const prettyBytes = require('pretty-bytes');

let config = require('./config');
let tcpServer;
let closing = false;
let running = false;
let timerMemoryAlert;

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

    config = Object.assign(config, options||{});

    if (config.NET_TCP_ENGINE === 'jsonrpc') {
        tcpServer = tcpJsonRpc;
    } else if (config.NET_TCP_ENGINE === 'binary') {
        tcpServer = tcpBinary;
    }

    loki.initialize();

    log.info(`memory limit: ${prettyBytes(config.MEM_LIMIT*1024*1024)}`);

    if (running) {
        callback && callback('ERUNNING');
        return;
    }

    log.info(
        'server starting ... (%s:%s)',
        config.NET_TCP_HOST,
        config.NET_TCP_PORT
    );

    timerMemoryAlert = setInterval(memoryAlert, 1000);

    tcpServer.start(err => {
        if (err) {
            log.error(err);
            return;
        }
        running = true;
        handleSignals();
        if (callback) {
            callback();
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

    tcpServer.stop(err => {
        clearInterval(timerMemoryAlert);
        log.info('server stopped, exiting');
        if (callback) {
            callback(err);
            return;
        }
        process.exit(err ? 1 : 0);
    });
}

function memoryAlert() {
    const heapTotal = process.memoryUsage().heapTotal;
    const max = config.MEM_LIMIT*1024*1024;
    if (heapTotal>max) {
        log.warn(
            'memory limit reached (used = %s/ max = %s)',
            prettyBytes(heapTotal),
            prettyBytes(max)
        );
        config.MEM_LIMIT_REACHED = true;
    } else {
        config.MEM_LIMIT_REACHED = false;
    }
}


if (global.gc) {
    log.info(`Garbage collector will run every ${config.GC_INTERVAL} ms`);
    setInterval(() => {
        log.info('garbage collector begin');
        global.gc();
        log.info('garbage collector end');
    }, config.GC_INTERVAL);
}

module.exports = {
    start,
    stop
};
