const JSONStream = require('JSONStream');
const debug = require('debug')('sloki-client');
const version = require('../package.json').version;
const Client = require('./BaseClient');

class MyClient extends Client {

    constructor(port, host, options) {
        if (!port) {
            if (options.protocol.match(/s$/)) {
                port = 6373;
            } else {
                port = 6372;
            }
        }
        super(port, host, options);
    }

    /*
     * Privates
     */

    _pipeSocket() {
        this._socket.pipe(this._jsonstream);
    }

    _unpipeSocket() {
        this._socket.unpipe(this._jsonstream);
    }

    _initializeStream() {

        this._jsonstream = JSONStream.parse();

        this._jsonstream.on('data', (data) => {

            const r = this._requests[data.id];

            // no callback stored for this request ?
            // fake id sent by the "server" ?
            if (!r) {
                if (data.error) {
                    debug(JSON.stringify(data.error));
                } else {
                    debug(JSON.stringify(data));
                }
                this._emit('error', data.error);
                return;
            }

            data.error && debug(data.error.message);

            if (r.method === 'versions' && typeof data.result === 'object') {
                data.result['sloki-node-client'] = version;
            }

            r.callback(data.error, data.result);
            delete this._requests[data.id];
        });
    }

    _requestSend(id, method, params) {

        let req = {
            jsonrpc:'2.0',
            id,
            method,
            params
        };

        req = JSON.stringify(req);
        this._socket.write(req);
        debug(req);
    }
}

module.exports = MyClient;
