const tap = require('../tap');
const endpoints = require('../endpoints');
const path = require('path');

let Client;

if (process.env.NODE_ENV === 'dev') {
    Client = require('../../../sloki-node-client');
} else {
    Client = require('sloki-node-client');
}

const engine = process.env.SLOKI_SERVER_ENGINE||'binary';

module.exports = (title, callback) => {

    const client = new Client(endpoints[engine], { engine });

    tap.test(
        path.basename(title),
        { timeout:1000*30 },
        t => {

            client.on('error', err => {
                t.fail('socket error', err);
                t.end();
            });

            client
                .connect()
                .then(err => {
                    t.deepEqual(err, undefined, `should be connected (${engine})`);
                    callback(t, client, () => {
                        client.close();
                    });
                })
                .catch(err => {
                    throw err;
                });
        }
    );

};
