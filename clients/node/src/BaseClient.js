const net = require('net');
const tls = require('tls');
const EventEmitter = require('events');
const debug = require('debug')('sloki-client');

// fastest uuid generator for sloki
const hyperid = require('hyperid');
const uuid = hyperid(true);

class BaseClient extends EventEmitter {

    constructor(port, host, options) {
        super();

        this._port = port;
        this._host = host;
        this._options = options || {};
        this._options.tls = this._options.protocol.match(/s$/);

        this._isConnected = false;
        this._requests = {};
        this._methods = [];
        this._eventsByName = null;
    }

    /*
     * Privates
     */

    _getMethods(callback) {
        this._request({
            method:'methods',
            callback:(err, methods) => {
                if (err) {
                    return callback(err);
                }

                this._methods = methods;

                for (const methodTitle in methods) {

                    debug(`register method ${methodTitle}`);

                    this[methodTitle] = (...args) => {

                        const lastArgType = args[args.length-1];

                        if (typeof lastArgType === 'function') {
                            this._request({
                                method:methodTitle,
                                params:args[0]||undefined,
                                callback:args[args.length-1]
                            });
                        } else if (typeof lastArgType === 'object' && lastArgType.lazy) {
                            this._request({
                                method:methodTitle,
                                params:args[0]||undefined
                            });
                        } else {
                            return new Promise((resolve, reject) => {
                                this._request({
                                    method:methodTitle,
                                    params:args[0]||undefined,
                                    resolve,
                                    reject
                                });
                            });
                        }
                    };
                }
                callback();
            }
        });
    }

    _eventExists(eventName) {

        if (this._eventsByName) {
            return this._eventsByName[eventName];
        }

        if (!this._eventsByName) {
            this._eventsByName = {};
            for (const ev of this.eventNames()) {
                this._eventsByName[ev] = true;
            }
        }

        return this._eventsByName[eventName];
    }

    _emit(eventName, data) {
        if (this._eventExists(eventName)) {
            this.emit(eventName, data);
        }
    }

    _pipeSocket() {
        // it may be overrided
    }

    _unpipeSocket() {
        // it may be overrided
    }

    _initializeStream() {
        throw new Error('Please override methode _initialize');
    }

    _initializeSocket(callback) {

        if (this._options.tls) {
            this._socket = tls.connect(this._port, this.host, {
                secureProtocol: 'TLSv1_2_method',
                rejectUnauthorized: false,
            });

            this._socket.on('secureConnect', () => {
                debug('connected (secure)');
                this._isConnected = true;
                this._getMethods(callback);
            });

        } else {
            this._socket = net.connect({
                port:this._port,
                host:this._host
            });

            this._socket.on('connect', () => {
                debug('connected');
                this._isConnected = true;
                this._getMethods(callback);
            });
        }

        this._socket.setNoDelay(true);

        this._socket.on('timeout', () => {
            debug('timeout');
            if (!this._isConnected) {
                this._socket.destroy();
                callback('timeout');
                return;
            }
            this._emit('timeout');
            this._close();
        });

        this._socket.on('error', (err) => {
            callback(err);
            this._emit('error', err);
            debug('error', err.message);
            this._unpipeSocket();
            this._socket.destroy();
        });

        this._socket.on('close', () => {
            this._emit('close');
            debug('close');
            this._unpipeSocket();
            this._isConnected = false;
        });

        this._socket.on('end', () => {
            this._emit('end');
            debug('end');
            this._unpipeSocket();
            this._isConnected = false;
            this._socket.destroy();
        });

        this._socket.on('destroy', () => {
            this._emit('destroy');
            debug('destroy');
            this._unpipeSocket();
            this._isConnected = false;
        });

        this._pipeSocket();
    }

    _close() {
        this._isConnected = false;
        this._socket.end();
    }

    _requestSend() {
        throw new Error('Please override methode _requestSend');
    }

    _requestPush(id, method, params, callback) {
        if (!this._isConnected) {
            callback(new Error('not connected'));
            return;
        }

        this._requests[id] = { method, params, callback };
        this._requestSend(id, method, params);
    }

    _request(op) {
        if (op.callback) {
            this._requestPush(uuid(), op.method, op.params, op.callback);
        } else if (op.reject && op.resolve) {
            this._requestPush(uuid(), op.method, op.params, (err, result) => {
                if (err) {
                    return op.reject(err);
                }
                op.resolve(result);
            });
        } else {
            if (!op.params) op.params = {};
            op.params.nr = 1;
            this._requestSend(uuid(), op.method, op.params);
        }
    }

    /*
     * Public
     */
    connect(callback) {
        this._initializeStream();
        if (!callback) {
            return new Promise((resolve, reject) => {
                this._initializeSocket((err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            });
        }

        this._initializeSocket(callback);

    }

    close(callback) {
        process.nextTick(() => {
            const pendingRequests = Object.keys(this._requests).length;
            if (pendingRequests>0) {
                debug(`closing client, but missed ${pendingRequests} pending requests`);
            }
            this._socket.end();
            if (callback) {
                callback();
            }
        });
    }

    getMethodsName() {
        return Object.keys(this._methods);
    }

    getMethodDescription(method) {
        if (!this._methods[method]) {
            return 'method not found';
        }

        return this._methods[method].description;
    }

}

module.exports = BaseClient;
