const log = require('evillogger')({ns:'transports:tcp'});

function start() {

}

function stop(callback) {
    callback();
}

module.exports = {
    start:start,
    stop:stop
}
