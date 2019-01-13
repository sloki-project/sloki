const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

function maxClients(params, callback) {
    let errorBadMaxClient = {
        code: -32602, // http://jsonrpc.org/spec.html#error_object
        message:"setMaxClients <number> where number is >= 1"
    }

    if (!params) {
        callback(errorBadMaxClient);
        return;
    }

    let maxClients = parseInt(params[0]);
    if (!maxClients) {
        callback(errorBadMaxClient);
        return;
    }

    ENV.NET_TCP_MAX_CLIENTS = maxClients;
    callback(null, maxClients);
}

module.exports = maxClients;
