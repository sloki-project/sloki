const tap = require('../tap');
const use = require('abrequire');
const Client = require('sloki-node-client');
const ENV = use('src/env');
const endpoint = require('../endpoints').tcp;
const path = require('path');

module.exports = (title, callback) => {

    const tcpClient = new Client(endpoint, { engine:ENV.NET_TCP_ENGINE });

    tap.test(
        path.basename(title),
        {
            timeout:ENV.DATABASES_AUTOSAVE_INTERVAL*3
        },
        (t) => {

            tcpClient.on('error', (err) => {
                t.fail('socket error', err);
                t.end();
            });

            tcpClient
                .connect()
                .then((err) => {
                    t.deepEqual(err, undefined, 'should be connected');
                    callback(t, tcpClient);
                });
        }
    );

    tap.test('close client', (t) => {
        tcpClient.close();
        t.pass('client closed');
        t.end();
        process.exit(0);
    });
};
