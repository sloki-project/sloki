const log = require('evillogger')({ns:'transports:tcp'});

function start(callback) {
    callback();
}

function stop(callback) {
    callback();
}

module.exports = {
    start:start,
    stop:stop
}
