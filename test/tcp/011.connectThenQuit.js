const tap = require('../tap');
const use = require('abrequire');
const Client = use('src/Client');
const endpoint = require('../endpoints').tcp;

let tcpClient = new Client(endpoint);

tap.test(
    __filename,
    {timeout:500},
    (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, 'connect should not return an error');
                t.pass("should be connected");
                try {
                    tcpClient.quit((err) => {
                        t.deepEqual(err, undefined, 'command should not return an error');
                        t.pass("should be disconnected by the server");
                        t.end();
                        process.exit(0);
                    })
                } catch(e) {
                    t.pass(e.message);
                    t.end();
                    process.exit(-1);
                }
            });
    }
);
