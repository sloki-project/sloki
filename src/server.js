const log = require('evillogger')({ns:'server'});
const path = require('path');
const async = require('async');
const jayson = require('jayson');
const use = require('abrequire');

const tcp = require('./transports/tcp');
const http = require('./transports/http');
const databases = use('src/databases');
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


function handleStartError(err, callback, next) {
    if (!err) {
        return next();
    }

    log.error(err);
    callback && callback(err);
}

function start(callback) {

    databases.initialize();

    if (running) {
        callback && callback('ERUNNING');
        return;
    }

    log.info(
        'server starting ... (%s:%s)',
        ENV.NET_TCP_HOST,
        ENV.NET_TCP_PORT
    );

    async.series(
        [
            next => {
                tcp.start((err) => {
                    handleStartError(err, callback, next);
                });
            },
            next => {
                http.start((err) => {
                    handleStartError(err, callback, next);
                })
            }
        ],
        () => {
            running = true;
            handleSignals();
            callback && callback();
        }
    )
}

function stop(callback) {
    if (!running) {
        callback && callback('ENOTRUNNING');
        return;
    }

    log.warn("shutdown in progress");

    async.series(
        [
            tcp.stop,
            http.stop
        ],
        (err) => {
            log.info("server stopped, exiting");
            if (callback) {
                callback(err);
                return;
            }
            process.exit(err ? 1 : 0);
        }
    )
}


module.exports = {
    start:start,
    stop:stop
}
