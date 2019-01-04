const log = require('evillogger')({ns:'transports:tcp'});
const ENV = require('../../env');
const net = require('net');
const command = require('../../commands');

let server;
let sockets = {};

let RESPONSE_SOCKET_CLOSED = "CLOSED\r\n"
let RESPONSE_SOCKET_MAX_CLIENT_REACHED = "EMAX_CLIENT_REACHED\r\n";

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


function socketsCount() {
    return Object.keys(sockets).length;
}

function commandHandler(socket, line) {
    command(line, socket, (err, result) => {
        if (err) {
            socket.write('ERR '+err.message+"\r\n");
            log.error(err.message);
        }
    });
}

function socketHandler(socket) {

    let src = `${socket.remoteAddress}:${socket.remotePort}`;

    if (socketsCount()>ENV.NET_TCP_MAX_CLIENTS) {
        log.error("%s => Max Clients reached (%s)", src, ENV.NET_TCP_MAX_CLIENTS);
        socket.write(RESPONSE_SOCKET_MAX_CLIENT_REACHED);
        socket.end();
        return;
    }

    ENV.NET_TCP_DEBUG && log.info("%s => connection opened", src);

    sockets[src] = socket;

    function socketOnData(data) {
        let line = data.toString().trim();
        if (!line) return;
        log.info("%s => received %s", src, line);
        commandHandler(socket, line);
    }

    function socketOnClose() {
        ENV.NET_TCP_DEBUG && log.info("%s <= connection closed normaly", src);
        delete sockets[src];
    }

    function socketOnError(err) {
        log.error(err);
    }

    socket.on("error", socketOnError);
    socket.on("close", socketOnClose);
    socket.on("data", socketOnData);
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
    for (src in sockets) {
        log.warn("%s <= closing connection", src);
        sockets[src].end(RESPONSE_SOCKET_CLOSED);
        delete sockets[src];
    }
    server.close();
    log.warn("all clients gone and TCP Server closed");
    callback && callback();
}

module.exports = {
    start:start,
    stop:stop
}
