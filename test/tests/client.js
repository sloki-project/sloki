const tap = require('../tap');
const config = require('../../src/config');
const endpoints = require('../endpoints');
const path = require('path');

let Client;

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'dev') {
    Client = require('../../../sloki-node-client');
} else {
    Client = require('sloki-node-client');
}


const engine = process.env.SLOKI_SERVER_ENGINE||'tcpbinary';

module.exports = (title, callback) => {

    const tcpClient = new Client(endpoints[engine], { engine });

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
