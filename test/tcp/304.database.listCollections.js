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
                    "listCollections",
                    (subtest)  => {
                        tcpClient.listCollections((err, result) => {
                            subtest.deepEqual(err, undefined, 'command should not return an error');
                            subtest.deepEqual(
                                result,
                                [],
                                "should return empty array"
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
