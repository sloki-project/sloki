const log = require('evillogger')({ns:'transports:tcp'});
const ENV = require('../../env');
const jayson = require('jayson');
const commandsList = require('../../commands').list;

const RESPONSE_SOCKET_SERVER_SHUTDOWN = "ESERVER_SHUTDOWN";
const RESPONSE_SOCKET_MAX_CLIENT_REACHED = "EMAX_CLIENT_REACHED";

const errors = {
    MAX_CLIENT_REACHED:{
        code: -32000,
        message:"Max Clients Reached"
    },
    SERVER_SHUTDOWN:{
        code: -32001,
        message:"Server shutdown"
    }
}

let jaysonServer;
let tcpServer;
let sockets = {};

function _onServerListen(err) {
    if (err) {
        console.log(err);
        throw new Error(err);
        process.exit(1);
    }

    log.info(
        "TCP Server listening at %s:%s (maxClients %s)",
        ENV.NET_TCP_HOST,
        ENV.NET_TCP_PORT,
        ENV.NET_TCP_MAX_CLIENTS
    );
}

function _handleMaxClients(socket) {

    this.options.router = (method, params) => {
        return this.options.routerTcp(method, params, socket);
    }

    socket.id = `${socket.remoteAddress}:${socket.remotePort}`;

    if (_maxClientsReached()) {
        log.warn(
            '%s: refusing connection, number of connection: %s, allowed: %s',
            socket.id,
            tcpServer._connections-1,
            ENV.NET_TCP_MAX_CLIENTS
        );

        // if client is just a tcp connect (prevent kind of slowLoris attack)
        setTimeout(() => {
            socket.end();
        },200);
        return;
    }

    socket.on('end', () => {
        log.info("%s: client disconnected", socket.id);
        delete sockets[socket.id];
    });

    sockets[socket.id] = socket;
    log.info("%s: client connected", socket.id);

}

function _maxClientsReached() {
    return tcpServer._connections>ENV.NET_TCP_MAX_CLIENTS;

}

function _maxClientsReachedResponse(params, callback) {
    callback(errors.MAX_CLIENT_REACHED);
}

function start(callback) {

    if (!ENV.NET_TCP_PORT) {
        callback(new Error('ENV.NET_TCP_PORT unavailable'));
        return;
    }

    jaysonServer = jayson.server(
        null, // no handlers, because we are using a router (below)
        {
            routerTcp: (method, params, socket) => {
                if (_maxClientsReached()) {
                    return _maxClientsReachedResponse;
                }
                if (commandsList[method]) {
                    log.info('%s: exec %s', socket.id, method);
                    return commandsList[method].bind(socket);
                }
            }
        }
    );

    tcpServer = jaysonServer.tcp();
    tcpServer.on('connection', _handleMaxClients);
    tcpServer.on('listening', _onServerListen);
    tcpServer.listen(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST);
    callback && callback();
}

function stop(callback) {
    for (id in sockets) {
        sockets[id].write(JSON.stringify({error:errors.SERVER_SHUTDOWN}));
        sockets[id].end();
        log.warn("%s: force disconnection", id);
        delete sockets[id];
    }

    tcpServer.close(() => {
        callback && callback();
    });

}

module.exports = {
    start:start,
    stop:stop
}
