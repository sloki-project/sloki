const tap = require('../tap');
const use = require('abrequire');
const Client = use('src/Client');
const endpoint = require('../endpoints').tcp;
const path = require('path');

module.exports = (title, callback) => {

    let tcpClient = new Client(endpoint);

    tap.test(path.basename(title), {timeout:500}, (t) => {
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
