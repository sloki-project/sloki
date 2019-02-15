const log = require('evillogger')({ ns:'transports:tcpJayson' });
const ENV = require('../env');
const jayson = require('jayson');
const methods = require('../methods/');

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

    log.info(`TCP Server listening at ${ENV.NET_TCP_HOST}:${ENV.NET_TCP_PORT} (maxClients ${ENV.NET_TCP_MAX_CLIENTS})`);
}

function _onServerError(err) {
    log.error(err);
}

function _handleMaxClients(socket) {

    socket.id = `${socket.remoteAddress}:${socket.remotePort}`;

    if (_maxClientsReached()) {
        log.warn(`${socket.id}: refusing connection, number of connection: ${tcpServer._connections-1}, allowed: ${ENV.NET_TCP_MAX_CLIENTS}`);

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
    return tcpServer._connections>ENV.NET_TCP_MAX_CLIENTS;
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

    ENV.SHOW_OPS_INTERVAL && operationsCount++;
    return methods.getHandler(method, params, socket);
}


function start(callback) {

    if (!ENV.NET_TCP_PORT) {
        callback(new Error('ENV.NET_TCP_PORT unavailable'));
        return;
    }

    jaysonServer = jayson.server(null, { routerTcp:router });

    tcpServer = jaysonServer.tcp({ allowHalfOpen:true });
    tcpServer.clients = {};

    tcpServer.on('connection', _onConnect);
    tcpServer.on('listening', _onServerListen);
    tcpServer.on('error', _onServerError);

    tcpServer.listen(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST);

    if (ENV.SHOW_OPS_INTERVAL) {
        timerShowOperationsCount = setInterval(showOperationsCount, ENV.SHOW_OPS_INTERVAL);
    }

    callback && callback();
}

function showOperationsCount() {
    log.info('%s ops/sec', Math.round((operationsCount*1000)/ENV.SHOW_OPS_INTERVAL));
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

    tcpServer.close((err) => {
        if (err) {
            log.error(err);
        }
        ENV.SHOW_OPS_INTERVAL && clearInterval(timerShowOperationsCount);
        callback && callback();
    });

}

module.exports = {
    start,
    stop
};
