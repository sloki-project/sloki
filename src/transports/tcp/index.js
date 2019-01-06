const log = require('evillogger')({ns:'transports:tcp'});
const ENV = require('../../env');
const net = require('net');

const LokySocket = require('./LokySocket');

let server;
let sockets = {};

const RESPONSE_SOCKET_SERVER_SHUTDOWN = "ESERVER_SHUTDOWN";
const RESPONSE_SOCKET_MAX_CLIENT_REACHED = "EMAX_CLIENT_REACHED";

function onServerListen(err) {
    if (err) {
        log.error(err);
        process.exit(1);
    }

    log.info(
        "TCP Server listening at %s:%s",
        ENV.NET_TCP_HOST,
        ENV.NET_TCP_PORT
    );
}


function socketCount() {
    return Object.keys(sockets).length;
}

function socketClose(socket) {
    delete sockets[socket.id];
}

function socketHandler(socket) {

    if (socketCount()>ENV.NET_TCP_MAX_CLIENTS) {
        log.error(
            "%s Max Clients reached (%s)",
            `${socket.remoteAddress}:${socket.remotePort}`,
            ENV.NET_TCP_MAX_CLIENTS
        );
        socket.write(RESPONSE_SOCKET_MAX_CLIENT_REACHED, {end:true});
        return;
    }

    socket = new LokySocket(socket, sockets);
    socket.onClose(socketClose);

    sockets[socket.id] = socket;

}


function start(callback) {
    if (!ENV.NET_TCP_PORT) {
        callback();
        return;
    }

    server = net.createServer(socketHandler);

    server.listen(
        ENV.NET_TCP_PORT,
        ENV.NET_TCP_HOST,
        onServerListen
    );
}

function stop(callback) {
    log.warn("shutdown in progress");
    for (id in sockets) {
        log.warn("%s closing connection", id);
        sockets[id].write(RESPONSE_SOCKET_SERVER_SHUTDOWN,{end:true});
        delete sockets[id];
    }
    log.warn("all clients gone");

    server.close();
    log.warn("TCP Server closed");

    callback && callback();
}

module.exports = {
    start:start,
    stop:stop
}
