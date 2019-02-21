const log = require('evillogger')({ ns:'tcpjsonrpc' });
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
let server;
let operationsCount = 0;
let timerShowOperationsCount;

function _onServerError(err) {
    log.error(err);
}

function _handleMaxClients(socket) {

    socket.id = `${socket.remoteAddress}:${socket.remotePort}`;

    if (_maxClientsReached()) {
        log.warn(`${socket.id}: refusing connection, number of connection: ${server._connections-1}, allowed: ${config.TCP_JSONRPC_MAX_CLIENTS}`);

        // if client is just a tcp connect (prevent kind of slowLoris attack)
        setTimeout(() => {
            socket.end();
        }, 200);
        return false;
    }

    socket.on('end', () => {
        log.info(`${socket.id}: client disconnected`);
        server.clients[socket.id].destroy();
        delete server.clients[socket.id];
    });

    socket.on('error', err => {
        log.error(`${socket.id}: ${err.message}`);
        delete server.clients[socket.id];
    });

    server.clients[socket.id] = socket;
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
    return server._connections>config.TCP_JSONRPC_MAX_CLIENTS;
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

    socket.engine = 'tcpjsonrpc';
    return methods.getHandler(method, params, socket);
}


function start(callback) {

    if (!config.TCP_JSONRPC_ENABLE) {
        callback();
        return;
    }

    log.info(`TCP JSONRPC Server starting ... (${config.TCP_JSONRPC_HOST}:${config.TCP_JSONRPC_PORT})`);

    function _onServerListen(err) {
        if (err) {
            log.error(err);
            throw new Error(err);
        }

        log.info(`TCP JSONRPC Server started (maxClients ${config.TCP_JSONRPC_MAX_CLIENTS})`);
        callback();
    }

    jaysonServer = jayson.server(null, { routerTcp:router });

    server = jaysonServer.tcp();
    server.clients = {};

    server.on('connection', _onConnect);
    server.on('listening', _onServerListen);
    server.on('error', _onServerError);

    server.listen(config.TCP_JSONRPC_PORT, config.TCP_JSONRPC_HOST);

    if (config.SHOW_OPS_INTERVAL) {
        timerShowOperationsCount = setInterval(showOperationsCount, config.SHOW_OPS_INTERVAL);
    }
}

function showOperationsCount() {
    log.info(Math.round((operationsCount*1000)/config.SHOW_OPS_INTERVAL), 'ops/sec');
    operationsCount = 0;
}

function stop(callback) {
    let id;
    let closed = 0;
    for (id in server.clients) {
        server.clients[id].write(JSON.stringify(errors.SERVER_SHUTDOWN));
        server.clients[id].end();
        server.clients[id].destroy();
        log.warn(`stop: ${id}: force disconnection`);
        closed++;
        delete server.clients[id];
    }

    if (closed) {
        log.warn(`${closed} client(s) has been closed`);
    }

    log.warn('closing server');

    server.close(err => {
        if (err) {
            log.error(err);
        }
        config.SHOW_OPS_INTERVAL && clearInterval(timerShowOperationsCount);
        callback();
    });

}

module.exports = {
    start,
    stop
};
