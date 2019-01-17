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
                    "clients",
                    (subtest)  => {
                        tcpClient.clients((err, result) => {
                            subtest.deepEqual(err, undefined, 'command should not return an error');

                            // example
                            // [ '127.0.0.1:1619' ]
                            subtest.equal(
                                result.length,
                                1,
                                "should return only one connected client"
                            );
                            subtest.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
