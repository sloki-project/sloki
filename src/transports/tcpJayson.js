const log = require('evillogger')({ns:'transports:tcpJayson'});
const ENV = require('../env');
const jayson = require('jayson');
const commands = require('../commands');

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
let operationsCount = 0;
let timerShowOperationsCount;

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

function _handleMaxClients(server, socket) {

    server.options.router = (method, params) => {
        return server.options.routerTcp(method, params, socket);
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
        return false;
    }

    socket.on('end', () => {
        log.info("%s: client disconnected", socket.id);
        delete tcpServer.clients[socket.id];
    });

    tcpServer.clients[socket.id] = socket;
    log.info("%s: client connected", socket.id);
    return true;
}

function _onConnect(socket) {
    if (_handleMaxClients(this, socket)) {
        socket.loki = {
            currentDatabase:'test'
        };
    }
}

function _maxClientsReached() {
    return tcpServer._connections>ENV.NET_TCP_MAX_CLIENTS;
}

function _maxClientsReachedResponse(params, callback) {
    callback(errors.MAX_CLIENT_REACHED);
}

function router(command, params, socket) {

    if (_maxClientsReached()) {
        return _maxClientsReachedResponse;
    }

    if (!commands.exists(command)) {
        log.warn('%s: could not find comand %s', socket.id, command);
        return;
    }

    /*
    if (params) {
        log.info('%s: exec %s', socket.id, command, JSON.stringify(params));
    } else {
        log.info('%s: exec %s', socket.id, command);
    }
    */

    ENV.SHOW_OPS_INTERVAL && operationsCount++;
    return commands.getHandler(command, params, socket);
}


function start(callback) {

    if (!ENV.NET_TCP_PORT) {
        callback(new Error('ENV.NET_TCP_PORT unavailable'));
        return;
    }

    jaysonServer = jayson.server(null, {routerTcp:router});

    tcpServer = jaysonServer.tcp();
    tcpServer.clients = {};
    tcpServer.on('connection', _onConnect);
    tcpServer.on('listening', _onServerListen);
    tcpServer.listen(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST);

    if (ENV.SHOW_OPS_INTERVAL) {
        timerShowOperationsCount = setInterval(showOperationsCount, ENV.SHOW_OPS_INTERVAL);
    }

    callback && callback();
}

function showOperationsCount() {
    log.info("%s ops/sec", Math.round((operationsCount*1000)/ENV.SHOW_OPS_INTERVAL));
    operationsCount = 0;
}

function stop(callback) {
    for (id in tcpServer.clients) {
        tcpServer.clients[id].write(JSON.stringify({error:errors.SERVER_SHUTDOWN}));
        tcpServer.clients[id].end();
        log.warn("%s: force disconnection", id);
        delete tcpServer.clients[id];
    }

    tcpServer.close(() => {
        ENV.SHOW_OPS_INTERVAL && clearInterval(timerShowOperationsCount);
        callback && callback();
    });

}

module.exports = {
    start:start,
    stop:stop
}
