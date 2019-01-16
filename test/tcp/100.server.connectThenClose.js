const tap = require('../tap');
const use = require('abrequire');
const Client = use('src/Client');
const endpoint = require('../endpoints').tcp;

let tcpClient = new Client(endpoint);

tap.test(
    __filename,
    {timeout:200},
    (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, 'connect should not return an error');
                t.pass("should be connected");
                tcpClient.close();
                t.end();
                process.exit(0);
            });
    }
);
