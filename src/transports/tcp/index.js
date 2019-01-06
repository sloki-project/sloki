const log = require('evillogger')({ns:'transports:tcp'});
const ENV = require('../../env');
const net = require('net');

const LokySocket = require('./LokySocket');

let server;
let sockets = {};

const RESPONSE_SOCKET_SERVER_SHUTDOWN = "ESERVER_SHUTDOWN";
const RESPONSE_SOCKET_MAX_CLIENT_REACHED = "EMAX_CLIENT_REACHED";

function socketCount() {
    return Object.keys(sockets).length;
}

function socketClose(socket) {
    delete sockets[socket.id];
}

function socketHandler(socket) {

    //log.info(socketCount(), ENV.NET_TCP_MAX_CLIENTS, socketCount()>ENV.NET_TCP_MAX_CLIENTS)

    welcome = socketCount()<ENV.NET_TCP_MAX_CLIENTS

    socket = new LokySocket(socket, sockets, welcome);
    socket.onClose(socketClose);

    if (!welcome) {
        log.error(
            "%s Max Clients reached (%s)",
            `${socket.remoteAddress}:${socket.remotePort}`,
            ENV.NET_TCP_MAX_CLIENTS
        );
        socket.write(RESPONSE_SOCKET_MAX_CLIENT_REACHED,{end:true});
        return;
    }

    sockets[socket.id] = socket;
}


function start(callback) {
    if (!ENV.NET_TCP_PORT) {
        callback();
        return;
    }

    function onServerListen(err) {
        if (err) {
            log.error(err);
            if (!callback) {
                process.exit(1);
            } else {
                callback(err);
            }
        }

        log.info(
            "TCP Server listening at %s:%s",
            ENV.NET_TCP_HOST,
            ENV.NET_TCP_PORT
        );

        callback && callback();
    }

    server = net.createServer(socketHandler);

    server.listen(
        ENV.NET_TCP_PORT,
        ENV.NET_TCP_HOST,
        onServerListen
    );
}

function stop(callback) {
    for (id in sockets) {
        sockets[id].setQuiet(true);
        sockets[id].write(RESPONSE_SOCKET_SERVER_SHUTDOWN,{end:true});
        log.warn("%s connection closed", id);
        delete sockets[id];
    }
    server.close(() => {
        callback && callback();
    });

}

module.exports = {
    start:start,
    stop:stop
}
