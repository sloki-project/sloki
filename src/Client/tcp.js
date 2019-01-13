const net = require('net');
const JSONStream = require('JSONStream');
const EventEmitter = require('events');
const uuid = require('uuid/v4');
const log = require('evillogger')({ns:'clientTcp'});

const ENV = require('@ENV');
const commands = require('@commands');

class ClientTCP extends EventEmitter {

    constructor(port, host) {
        super();
        this.private = {};
        this.private.isConnected = false;
        this.private.requests = {};
        this.options = {host, port};
        this.cmd = {};
        this.defaults = {
            timeout:1000
        }

        // load all commands
        for (let command in commands.list) {
            this[command] = (params, cb) => {
                this._request(command, params, cb);
                return this;
            }
        }

    }

    connect() {

        return new Promise((resolve, reject) => {

            this.private.jsonstream = JSONStream.parse();

            this.private.jsonstream.on('data', (data) => {
                this.emit("response", data);

                if(!this.private.requests[data.id]) {
                    log.warn(JSON.stringify(data.error));
                    //this.emit("error", data.error);
                    return;
                }

                if (this.private.requests[data.id].callback) {
                    this.private.requests[data.id].callback(data.error, data.result);
                } else {
                    if (data.error) {
                        this.private.requests[data.id].reject(data.error);
                    } else {
                        this.private.requests[data.id].resolve(data.result);
                    }
                }
                delete this.private.requests[data.id];
            });

            this.private.conn = net.connect(this.options.port, this.options.host, (err) => {
                if (err) {
                    return reject(err);
                }
                this.private.isConnected = true;
                return resolve();
            });

            this.private.conn.pipe(this.private.jsonstream);

            //his.conn.setTimeout(this.defaults.timeout);

            this.private.conn.on('timeout', () => {
                log.debug('onTimeout');
                this._close();
            });

            this.private.conn.on('error', (err) => {
                log.error('onError', err.message);
                this.private.conn.destroy();
            });

            this.private.conn.on('close', () => {
                log.debug('onClose');
                this.private.isConnected = false;
            });

            this.private.conn.on('end', () => {
                log.debug('onEnd');
                this.private.isConnected = false;
            });

            this.private.conn.on('destroy', () => {
                log.debug('_onDestroy');
                this.private.isConnected = false;
            });

        });
    }

    _close() {
        this.private.isConnected = false;
        this.private.conn.end();
    }

    _requestSend(id, method, params) {

        let req = {
            jsonrpc:"2.0",
            id,
            method
        }

        if (params != null && params != undefined) {
            req.params = params;
        }

        this.private.conn.write(JSON.stringify(req));
    }

    _requestWithCallback(id, method, params, callback) {
        if (!this.private.isConnected) {
            callback(new Error('not connected'));
            return;
        }
        this.private.requests[id] = {callback};
        this._requestSend(id, method, params);
    }

    _requestWithPromise(id, method, params) {
        return new Promise((resolve, reject) => {
          if (!this.private.isConnected) {
              reject(new Error('not connected'));
              return;
          }
          this.private.requests[id] = {resolve, reject};
          this._requestSend(id, method, params);
        })
    }

    _request(method, params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        let id = uuid();

        if (callback) {
            this._requestWithCallback(id, method, params, callback);
        } else {
            return this._requestWithPromise(id, method, params);
        }
    }

    close() {
        this.private.conn.end();
    }


}

module.exports = ClientTCP;
