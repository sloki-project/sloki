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

    config = Object.assign(config, options||{});

    if (config.NET_TCP_ENGINE === 'jsonrpc') {
        tcpServer = tcpJsonRpc;
    } else if (config.NET_TCP_ENGINE === 'binary') {
        tcpServer = tcpBinary;
    }

    loki.initialize();

    if (running) {
        callback && callback('ERUNNING');
        return;
    }

    log.info(
        'server starting ... (%s:%s)',
        config.NET_TCP_HOST,
        config.NET_TCP_PORT
    );

    timerMemoryAlert = setInterval(memoryAlert, memoryAlertInterval);

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
        running = false;
        if (callback) {
            callback(err);
            return;
        }
        process.exit(err ? 1 : 0);
    });
}

function dumpMemory(level, prefix, mem) {
    log[level](
        //'%s (rss=%s, heapTotal=%s, heapUsed=%s, external=%s, allowed %s)',
        '%s rss=%s, allowed %s',
        prefix,
        prettyBytes(mem.rss),
        //prettyBytes(mem.heapTotal),
        //prettyBytes(mem.heapUsed),
        //prettyBytes(mem.external),
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
