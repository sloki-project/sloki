const log = require('evillogger')({ ns:'transports:tcpJayson' });
const ENV = require('../env');
const jayson = require('jayson');

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

function _handleMaxClients(server, socket) {

    socket.id = `${socket.remoteAddress}:${socket.remotePort}`;

    socket.on('end', () => {
        log.info(`${socket.id}: client disconnected`);
        tcpServer.clients[socket.id].destroy();
        delete tcpServer.clients[socket.id];
    });

    tcpServer.clients[socket.id] = socket;
    log.info(`${socket.id}: client connected`);

    if (server.options.routerTcp) {
        server.options.router = (method, params) => {
            return server.options.routerTcp(method, params, socket);
        };
    }

    if (_maxClientsReached()) {
        log.warn(`${socket.id}: refusing connection, number of connection: ${tcpServer._connections-1}, allowed: ${ENV.NET_TCP_MAX_CLIENTS}`);

        // if client is just a tcp connect (prevent kind of slowLoris attack)
        setTimeout(() => {
            socket.end();
        }, 200);
        return false;
    }

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


function start(callback) {

    if (!ENV.NET_TCP_PORT) {
        callback(new Error('ENV.NET_TCP_PORT unavailable'));
        return;
    }

    const methods = {
        commands(args, callback) {
            callback(null, {
                'insert':{},
                'loadDatabase':{
                    name:'loadDatabase',
                    categories:['database'],
                    description:{
                        short:'Select a database (if not exist, a new db will be created)'
                    },
                    parameters:[
                        {
                            name:'database name',
                            mandatory:true,
                            mandatoryError:'Database name is mandatory',
                            description:'Database name'
                        },
                        {
                            name:'Options',
                            mandatory:false,
                            description:'Database options',
                            sanityCheck:{
                                type:'object'
                            }
                        }
                    ]
                }
            });
        },
        loadDatabase(args, callback) {
            //console.log('loadDatabase');
            callback();
        },
        insert(args, callback) {
            //console.log('insert');
            ENV.SHOW_OPS_INTERVAL && operationsCount++;
            callback();
        }
    };

    jaysonServer = jayson.server(methods);

    tcpServer = jaysonServer.tcp();
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
