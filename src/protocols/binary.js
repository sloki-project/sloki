const methods = require('../methods/');
const shared = require('../methods/shared');
const net = require('net');
const tls = require('tls');
const missive = require('missive');
const errors = require('./errors');

const ZLIB = false;

function Server(options) {

    let server;
    let operationsCount = 0;
    let timerShowOperationsCount;
    let engine;

    if (options.SSL) {
        engine = 'tlsbinary';
    } else {
        engine = 'tcpbinary';
    }

    const log = require('evillogger')({ ns:engine });


    function rpcIn(task) {

        methods.exec(task.data.m, task.data.p, { server, session:task.socket }, (err, result) => {

            if (err) {

                if (err instanceof Error) {
                    task.encoder.write({
                        id:task.data.id,
                        error:{
                            code:shared.ERROR_CODE_PARAMETER,
                            message:err.message
                        }
                    });

                    log.error(`${task.socket.id}: ${err.stack}`);
                    return;
                }

                task.encoder.write({ id: task.data.id, error: err });
                log.warn(`${task.socket.id}: ${err.message}`);
                return;
            }

            task.encoder.write({
                id:task.data.id,
                r:result
            });
        });
    }

    function _onServerError(err) {
        log.error(err);
    }

    function _onConnect(socket) {

        socket.id = `${socket.remoteAddress}:${socket.remotePort}`;
        socket.loki = {
            currentDatabase:'test'
        };

        socket.on('end', () => {
            log.info(`${socket.id}: client disconnected`);
            server.clients[socket.id].socket.destroy();
            delete server.clients[socket.id];
        });

        socket.on('error', err => {
            log.error(`${socket.id}: ${err.message}`);
            delete server.clients[socket.id];
        });

        log.info(`${socket.id}: client connected`);

        const encoder = missive.encode({ deflate: ZLIB });
        const decoder = missive.parse({ inflate: ZLIB });

        decoder.on('message', data => {

            if (server._connections>options.MAX_CLIENTS) {
                log.warn(`${socket.id}: refusing connection, number of connection: ${server._connections-1}, allowed: ${options.MAX_CLIENTS}`);
                encoder.write({ id: data.id, error:errors.MAX_CLIENT_REACHED });
                socket.end();
                return;
            }

            if (!data.m) {
                log.error(`${socket.id}: missing method in the payload`);
                return;
            }

            if (!methods.exists(data.m)) {
                log.warn(`${socket.id}: unknow method ${data.m}`);
                return;
            }

            if (data.p) {
                log.debug(`${socket.id}: exec ${data.m} ${JSON.stringify(data.p)}`);
            } else {
                log.debug(`${socket.id}: exec ${data.m}`);
            }

            options.SHOW_OPS_INTERVAL && operationsCount++;

            rpcIn({ data, socket, encoder });
        });

        decoder.on('error', err => {
            log.error(err);
        });

        socket.pipe(decoder);
        encoder.pipe(socket);

        server.clients[socket.id] = { socket, encoder };

    }

    function showOperationsCount() {
        const c = Math.round((operationsCount*1000)/options.SHOW_OPS_INTERVAL);
        if (c>0) log.info(c, 'ops/sec');
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

        if (options.SSL) {

            server = tls.createServer({
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
            server = net.createServer();
            server.on('connection', _onConnect);
        }

        server.engine = engine;
        server.clients = {};
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
        let closed = 0;
        try {
            let id;
            for (id in server.clients) {
                server.clients[id].encoder.write(JSON.stringify({ error:errors.SERVER_SHUTDOWN }));
                server.clients[id].socket.end();
                server.clients[id].socket.destroy();
                log.warn(`disconnect client ${id}`);
                closed++;
                delete server.clients[id];
            }
        } catch(e) {
            log.error(e);
        }

        if (closed) {
            log.warn(`${closed} client(s) has been closed`);
        }

        server.close(err => {
            if (err) {
                log.error(err);
            }
            if (options.SHOW_OPS_INTERVAL) {
                clearInterval(timerShowOperationsCount);
            }

            log.warn('server closed');

            if (callback) {
                callback();
            }
        });
    }

    return { start, stop };
}


module.exports = Server;
