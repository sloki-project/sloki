const tap = require('../tap');
const use = require('abrequire');
const endpoint = require('../endpoints').tcp;
const Client = use('src/Client');

let tcpClient = new Client(endpoint);
let dbName = "__testUse";

tap.test(
    __filename,
    {timeout:500},
    (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, 'connect should not return an error');

                t.test(
                    "use",
                    (subtest)  => {
                        tcpClient.use(dbName, (err, result) => {
                            subtest.deepEqual(err, undefined, 'command should not return an error');
                            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
                            subtest.end();
                        });
                    }
                )

                t.test(
                    "db",
                    (subtest)  => {
                        tcpClient.db((err, result) => {
                            subtest.deepEqual(err, undefined, 'command should not return an error');
                            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
                            subtest.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
