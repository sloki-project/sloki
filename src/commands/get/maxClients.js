const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');

function maxClients(options, callback) {
    options.socket.write(ENV.NET_TCP_MAX_CLIENTS.toString(),{prompt:true});
    callback();
}

module.exports = maxClients;
