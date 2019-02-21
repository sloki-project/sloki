const log = require('evillogger')({ ns:'tcpbinary' });
const config = require('../../config');
const methods = require('../../methods/');
const shared = require('../../methods/shared');
const net = require('net');
const missive = require('missive');

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

const ZLIB = false;

let server;
let operationsCount = 0;
let timerShowOperationsCount;

function rpcIn(task) {

    task.socket.engine = 'tcpbinary';

    methods.exec(task.data.m, task.data.p, task.socket, (err, result) => {

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

        if (server._connections>config.TCP_BINARY_MAX_CLIENTS) {
            log.warn(`${socket.id}: refusing connection, number of connection: ${server._connections-1}, allowed: ${config.TCP_BINARY_MAX_CLIENTS}`);
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

        config.SHOW_OPS_INTERVAL && operationsCount++;

        rpcIn({ data, socket, encoder });
    });

    decoder.on('error', err => {
        log.error(err);
    });

    socket.pipe(decoder);
    encoder.pipe(socket);

    server.clients[socket.id] = { socket, encoder };

}

function start(callback) {

    if (!config.TCP_BINARY_ENABLE) {
        callback();
        return;
    }

    log.info(`TCP Binary Server starting ... (${config.TCP_BINARY_HOST}:${config.TCP_BINARY_PORT})`);

    function _onServerListen(err) {

        if (err) {
            log.error(err);
            throw new Error(err);
        }

        log.info(`TCP Binary Server started (maxClients ${config.TCP_BINARY_MAX_CLIENTS})`);
        callback();
    }

    server = net.createServer();
    server.clients = {};

    server.on('connection', _onConnect);
    server.on('listening', _onServerListen);
    server.on('error', _onServerError);

    server.listen(config.TCP_BINARY_PORT, config.TCP_BINARY_HOST);

    if (config.SHOW_OPS_INTERVAL) {
        timerShowOperationsCount = setInterval(showOperationsCount, config.SHOW_OPS_INTERVAL);
    }

}

function showOperationsCount() {
    log.info(Math.round((operationsCount*1000)/config.SHOW_OPS_INTERVAL), 'ops/sec');
    operationsCount = 0;
}

function stop(callback) {
    let closed = 0;
    try {
        let id;
        for (id in server.clients) {
            server.clients[id].encoder.write(JSON.stringify({ error:errors.SERVER_SHUTDOWN }));
            server.clients[id].socket.end();
            server.clients[id].socket.destroy();
            log.warn(`stop: ${id}: force disconnection`);
            closed++;
            delete server.clients[id];
        }
    } catch(e) {
        log.error(e);
    }

    if (closed) {
        log.warn(`${closed} client(s) has been closed`);
    }

    log.warn('closing server');

    server.close(err => {
        if (err) {
            log.error(err);
        }
        if (config.SHOW_OPS_INTERVAL) {
            clearInterval(timerShowOperationsCount);
        }
        if (callback) {
            callback();
        }
    });

}

module.exports = {
    start,
    stop
};
