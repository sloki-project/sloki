const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');

let errorBadMaxClient = {
    code: -32602, // http://jsonrpc.org/spec.html#error_object
    message:"maxClients <number> where number is >= 1"
}

function maxClients(params, callback) {
    if (!params) {
        callback(null, ENV.NET_TCP_MAX_CLIENTS);
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
