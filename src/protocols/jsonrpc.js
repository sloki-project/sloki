const jayson = require('jayson');
const methods = require('../methods/');
const errors = require('./libs/errors');

function Server(options) {

    let jaysonServer;
    let server;
    let operationsCount = 0;
    let totalOperationsCount = 0;
    let timerShowOperationsCount;
    let protocol;

    if (options.SSL) {
        protocol = 'jsonrpcs';
    } else {
        protocol = 'jsonrpc';
    }

    const log = require('evillogger')({ ns:protocol });

    function _onServerError(err) {
        log.error(err);
    }

    function _handleMaxClients(socket) {

        socket.id = `${socket.remoteAddress}:${socket.remotePort}`;

        if (_maxClientsReached()) {
            log.warn(`${socket.id}: refusing connection, number of connection: ${server._connections-1}, allowed: ${options.MAX_CLIENTS}`);

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
        return server._connections>options.MAX_CLIENTS;
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

        options.SHOW_OPS_INTERVAL && operationsCount++;
        totalOperationsCount++;

        return methods.getHandler(method, params, { server, session:socket });
    }

    function showOperationsCount() {
        const c = Math.round((operationsCount*1000)/options.SHOW_OPS_INTERVAL);
        if (operationsCount>0) {
            log.info(c, 'ops/sec', totalOperationsCount, 'ops');
        }
        operationsCount = 0;
    }

    function start(callback) {

        log.info(`server starting ... (${options.HOST}:${options.PORT} maxClients ${options.MAX_CLIENTS})`);

        function _onServerListen(err) {
            if (err) {
                log.error(err);
                throw new Error(err);
            }

            //log.info(`server started (maxClients ${options.MAX_CLIENTS})`);
            callback();
        }

        jaysonServer = jayson.server(null, { routerTcp:router });
        if (options.SSL) {

            server = jaysonServer.tls({
                key:options.SSL_PRIVATE_KEY,
                cert:options.SSL_CERTIFICATE,
                ca:[options.SSL_CA],
                secureProtocol: 'TLSv1_2_method',
                rejectUnauthorized: false
            });

            server.on('tlsClientError', (err) => {
                log.error(err.message);
            });

            server.on('secureConnection', _onConnect);

        } else {

            server = jaysonServer.tcp();
            server.on('connection', _onConnect);

        }
        server.clients = {};
        server.protocol = protocol;
        server.on('listening', _onServerListen);
        server.on('error', _onServerError);

        server.getMaxClients = function() {
            return options.MAX_CLIENTS;
        };

        server.setMaxClients = function(m) {
            options.MAX_CLIENTS = m;
        };

        server.listen(options.PORT, options.HOST);

        if (options.SHOW_OPS_INTERVAL) {
            timerShowOperationsCount = setInterval(showOperationsCount, options.SHOW_OPS_INTERVAL);
        }
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

        server.close(err => {
            if (err) {
                log.error(err);
            }
            log.warn('server closed');
            options.SHOW_OPS_INTERVAL && clearInterval(timerShowOperationsCount);
            callback();
        });
    }

    return { start, stop };
}

module.exports = Server;
