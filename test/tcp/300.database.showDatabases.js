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
                    "showDatabases",
                    (tShowDatabases)  => {
                        tcpClient.showDatabases((err, result) => {
                            tShowDatabases.deepEqual(err, undefined, 'command should not return an error');

                            // example
                            // [ 'test' ]
                            tShowDatabases.deepEqual(
                                result,
                                ['test'],
                                "should return only one database (named 'test')"
                            );

                            tShowDatabases.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
