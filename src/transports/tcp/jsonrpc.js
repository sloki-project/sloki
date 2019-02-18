const log = require('evillogger')({ ns:'transports:jsonrpc' });
const config = require('../../config');
const jayson = require('jayson');
const methods = require('../../methods/');

const errors = {
    MAX_CLIENT_REACHED:{
        code: -32000,
        message:'Max Clients Reached'
    },
    SERVER_SHUTDOWN:{
        code: -32001,
        message:'Server shutdown'
    }
};

let jaysonServer;
let tcpServer;
let operationsCount = 0;
let timerShowOperationsCount;

function _onServerListen(err) {
    if (err) {
        log.error(err);
        throw new Error(err);
    }

    log.info(`TCP Server listening at ${config.NET_TCP_HOST}:${config.NET_TCP_PORT} (maxClients ${config.NET_TCP_MAX_CLIENTS}, raw jsonrpc protocol)`);
}

function _onServerError(err) {
    log.error(err);
}

function _handleMaxClients(socket) {

    socket.id = `${socket.remoteAddress}:${socket.remotePort}`;

    if (_maxClientsReached()) {
        log.warn(`${socket.id}: refusing connection, number of connection: ${tcpServer._connections-1}, allowed: ${config.NET_TCP_MAX_CLIENTS}`);

        // if client is just a tcp connect (prevent kind of slowLoris attack)
        setTimeout(() => {
            socket.end();
        }, 200);
        return false;
    }

    socket.on('end', () => {
        log.info(`${socket.id}: client disconnected`);
        tcpServer.clients[socket.id].destroy();
        delete tcpServer.clients[socket.id];
    });

    socket.on('error', err => {
        log.error(`${socket.id}: ${err.message}`);
        delete tcpServer.clients[socket.id];
    });

    tcpServer.clients[socket.id] = socket;
    log.info(`${socket.id}: client connected`);
    return true;
}

function _onConnect(socket) {
    if (_handleMaxClients(socket)) {
        socket.loki = {
            currentDatabase:'test'
        };
    }

    this.options.router = (method, params) => {
        return this.options.routerTcp(method, params, socket);
    };

}

function _maxClientsReached() {
    return tcpServer._connections>config.NET_TCP_MAX_CLIENTS;
}

function _maxClientsReachedResponse(params, callback) {
    callback(errors.MAX_CLIENT_REACHED);
}

function router(method, params, socket) {

    if (_maxClientsReached()) {
        return _maxClientsReachedResponse;
    }

    if (!methods.exists(method)) {
        log.warn('%s: could not find comand %s', socket.id, method);
        return;
    }

    if (params) {
        log.debug('%s: exec %s', socket.id, method, JSON.stringify(params));
    } else {
        log.debug('%s: exec %s', socket.id, method);
    }

    config.SHOW_OPS_INTERVAL && operationsCount++;
    return methods.getHandler(method, params, socket);
}


function start(callback) {

    jaysonServer = jayson.server(null, { routerTcp:router });

    tcpServer = jaysonServer.tcp();
    tcpServer.clients = {};

    tcpServer.on('connection', _onConnect);
    tcpServer.on('listening', _onServerListen);
    tcpServer.on('error', _onServerError);

    tcpServer.listen(config.NET_TCP_PORT, config.NET_TCP_HOST);

    if (config.SHOW_OPS_INTERVAL) {
        timerShowOperationsCount = setInterval(showOperationsCount, config.SHOW_OPS_INTERVAL);
    }

    callback && callback();
}

function showOperationsCount() {
    log.info('%s ops/sec', Math.round((operationsCount*1000)/config.SHOW_OPS_INTERVAL));
    operationsCount = 0;
}

function stop(callback) {
    let id;
    let closed = 0;
    for (id in tcpServer.clients) {
        tcpServer.clients[id].write(JSON.stringify(errors.SERVER_SHUTDOWN));
        tcpServer.clients[id].end();
        tcpServer.clients[id].destroy();
        log.warn(`stop: ${id}: force disconnection`);
        closed++;
        delete tcpServer.clients[id];
    }

    if (closed) {
        log.warn(`stop: ${closed} client(s) has been closed`);
    } else {
        log.warn('stop: no client was connected');
    }

    log.warn('stop: closing TCP server');

    tcpServer.close(err => {
        if (err) {
            log.error(err);
        }
        config.SHOW_OPS_INTERVAL && clearInterval(timerShowOperationsCount);
        if (callback) {
            callback();
        }
    });

}

module.exports = {
    start,
    stop
};
