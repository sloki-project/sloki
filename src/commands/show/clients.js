const log = require('evillogger')({ns:'commands'});
const ENV = require('../../env');
const sprintf = require('sprintf-js').sprintf;
const moment = require('moment');
require('moment-duration-format');

/**
 * Client ask for clients list
 *
 * @example
 * > show clients
 * ...
 *
 * @param {object} options - options.command, options.params. options.socket
 * @param {function} callback - callback
 * @memberof Commands
 */
function showClients(options, callback) {
    let currentClients = Object.keys(options.socket.pool);
    let clients = {};
    let clientId;

    for (let i = 0;i<currentClients.length;i++) {
        clientId = currentClients[i];
        clients[clientId] = {
            uptime:moment
                    .duration(options.socket.pool[clientId].getUptime(), "ms")
                    .format("d[d] h[h]:m[m]:s[s]")
        }
    }

    if (options.socket.getOutputFormat() === "json") {
        options.socket.write(used,{prompt:true});
        callback && callback();
        return;
    }

    if (options.socket.getOutputFormat() === "text") {
        for (let cid in clients) {
            options.socket.write(
                sprintf(
                    "%-10s %20s",
                    cid,
                    clients[cid].uptime
                )
            );
        }
        options.socket.prompt();
        callback && callback();
        return;
    }
}

module.exports = showClients;
