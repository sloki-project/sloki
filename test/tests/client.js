const tap = require('../tap');
const Client = require('sloki-node-client');
const config = require('../../src/config');
const endpoint = require('../endpoints').tcp;
const path = require('path');

const engine = process.env.SLOKI_TCP_ENGINE||'binary';

module.exports = (title, callback) => {

    const tcpClient = new Client(endpoint, { engine });

    function end() {
        tcpClient.close();
    }

    tap.test(
        path.basename(title),
        { timeout:config.DATABASES_AUTOSAVE_INTERVAL*3 },
        t => {

            tcpClient.on('error', err => {
                t.fail('socket error', err);
                t.end();
            });

            tcpClient
                .connect()
                .then(err => {
                    t.deepEqual(err, undefined, `should be connected (${engine})`);
                    callback(t, tcpClient, end);
                });
        }
    );

};
