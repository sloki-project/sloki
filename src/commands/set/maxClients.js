const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');
const databases = require('../../databases');

function maxClients(options, callback) {

    if (!options.params) {
        callback(new Error("set maxClients <number>"));
        return;
    }

    let maxClients = parseInt(options.params);
    if (!maxClients) {
        callback(new Error("set maxClients <number>"));
        return;
    }

    ENV.NET_TCP_MAX_CLIENTS = maxClients;

    options.socket.write("NET_TCP_MAX_CLIENTS is now '"+ENV.NET_TCP_MAX_CLIENTS+"'",{prompt:true});
    callback();
}

module.exports = maxClients;
