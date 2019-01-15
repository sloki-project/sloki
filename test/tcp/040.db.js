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
                    "db",
                    (tDb)  => {
                        tcpClient.db((err, result) => {
                            tDb.deepEqual(err, undefined, 'command should not return an error');

                            // example
                            // test
                            tDb.deepEqual(
                                result,
                                "test",
                                "current database should be 'test'"
                            );

                            tDb.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
