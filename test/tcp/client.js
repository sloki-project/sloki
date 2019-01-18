const tap = require('../tap');
const use = require('abrequire');
const Client = use('src/Client');
const ENV = use('src/env');
const endpoint = require('../endpoints').tcp;
const path = require('path');

module.exports = (title, callback) => {

    let tcpClient = new Client(endpoint);

    tap.test(path.basename(title), {timeout:ENV.DATABASES_AUTOSAVE_INTERVAL*3}, (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, "should be connected");
                callback(t, tcpClient);
            });
    });

    tap.test('exit', (t) => {
        t.end();
        process.exit();
    });
}
