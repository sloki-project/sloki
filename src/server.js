const log = require('evillogger')({ ns:'server' });
const use = require('abrequire');

const tcp = require('./transports/tcpJayson');
const loki = require('./loki');
const ENV = use('src/env');

let closing = false;
let running = false;


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


function start(callback) {

    loki.initialize();

    if (running) {
        callback && callback('ERUNNING');
        return;
    }

    log.info(
        'server starting ... (%s:%s)',
        ENV.NET_TCP_HOST,
        ENV.NET_TCP_PORT
    );

    tcp.start((err) => {
        if (err) {
            log.error(err);
            return;
        }
        running = true;
        handleSignals();
        callback && callback();
    });

}

function stop(callback) {
    if (!running) {
        callback && callback('ENOTRUNNING');
        return;
    }

    log.warn('shutdown in progress');

    tcp.stop((err) => {
        log.info('server stopped, exiting');
        if (callback) {
            callback(err);
            return;
        }
        process.exit(err ? 1 : 0);
    });
}


module.exports = {
    start,
    stop
};
