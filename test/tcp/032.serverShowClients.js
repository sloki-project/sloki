const tap = require('../tap');
const use = require('abrequire');
const endpoint = require('../endpoints').tcp;

const Client = use('src/Client');

let tcpClient = new Client(endpoint);

tap.test(
    __filename,
    {timeout:500},
    (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, 'connect should not return an error');

                t.test(
                    "showClients",
                    (tShowClients)  => {
                        tcpClient.showClients((err, result) => {
                            tShowClients.deepEqual(err, undefined, 'command should not return an error');

                            // example
                            // [ '127.0.0.1:1619' ]
                            tShowClients.equal(
                                result.length,
                                1,
                                "should return only one connected client"
                            );
                            tShowClients.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
