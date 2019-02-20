const log = require('evillogger')({ ns:'transports:binary' });
const config = require('../../config');
const methods = require('../../methods/');
const shared = require('../../methods/shared');
const net = require('net');
const missive = require('missive');
const prettyBytes = require('pretty-bytes');

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

let tcpServer;
let operationsCount = 0;
let timerShowOperationsCount;

function rpcIn(task) {

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

function _onServerListen(err) {
    if (err) {
        log.error(err);
        throw new Error(err);
    }

    log.info(`TCP Server listening at ${config.TCP_HOST}:${config.TCP_PORT} (maxClients ${config.TCP_MAX_CLIENTS}, binary protocol)`);
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
        tcpServer.clients[socket.id].socket.destroy();
        delete tcpServer.clients[socket.id];
    });

    socket.on('error', err => {
        log.error(`${socket.id}: ${err.message}`);
        delete tcpServer.clients[socket.id];
    });

    log.info(`${socket.id}: client connected`);

    const encoder = missive.encode({ deflate: ZLIB });
    const decoder = missive.parse({ inflate: ZLIB });

    decoder.on('message', data => {

        if (tcpServer._connections>config.TCP_MAX_CLIENTS) {
            log.warn(`${socket.id}: refusing connection, number of connection: ${tcpServer._connections-1}, allowed: ${config.TCP_MAX_CLIENTS}`);
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

        //q.push({ data, socket, encoder });
        rpcIn({ data, socket, encoder });
    });

    decoder.on('error', err => {
        log.error(err);
    });

    socket.pipe(decoder);
    encoder.pipe(socket);

    tcpServer.clients[socket.id] = { socket, encoder };

}

function start(callback) {

    tcpServer = net.createServer();
    tcpServer.maxConnections = config.TCP_MAX_CLIENTS+1;
    tcpServer.clients = {};

    tcpServer.on('connection', _onConnect);
    tcpServer.on('listening', _onServerListen);
    tcpServer.on('error', _onServerError);

    tcpServer.listen(config.TCP_PORT, config.TCP_HOST);

    if (config.SHOW_OPS_INTERVAL) {
        timerShowOperationsCount = setInterval(showOperationsCount, config.SHOW_OPS_INTERVAL);
    }

    if (callback) {
        callback();
    }
}

function showOperationsCount() {
    log.info(
        '%s ops/sec %s/%s',
        Math.round((operationsCount*1000)/config.SHOW_OPS_INTERVAL),
        prettyBytes(process.memoryUsage().heapTotal),
        prettyBytes(config.MEM_LIMIT*1024*1024)
    );
    operationsCount = 0;
}

function stop(callback) {
    let closed = 0;
    try {
        let id;
        for (id in tcpServer.clients) {
            tcpServer.clients[id].encoder.write(JSON.stringify({ error:errors.SERVER_SHUTDOWN }));
            tcpServer.clients[id].socket.end();
            tcpServer.clients[id].socket.destroy();
            log.warn(`stop: ${id}: force disconnection`);
            closed++;
            delete tcpServer.clients[id];
        }
    } catch(e) {
        log.error(e);
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
