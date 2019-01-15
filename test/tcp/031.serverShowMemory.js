const tap = require('../tap');
const use = require('abrequire');
const endpoint = require('../endpoints').tcp;

const Client = use('src/Client');
const ENV = use('src/env');

let tcpClient = new Client(endpoint);
let maxClients = ENV.NET_TCP_MAX_CLIENTS;

tap.test(
    __filename,
    {timeout:500},
    (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, 'connect should not return an error');

                t.test(
                    "showMemory",
                    (tShowMemory)  => {
                        tcpClient.showMemory((err, result) => {
                            tShowMemory.deepEqual(err, undefined, 'command should not return an error');

                            // example
                            // { rss: '34.7 MB', heapTotal: '18.2 MB', heapUsed: '13.3 MB', external: '2.39 MB' }

                            tShowMemory.equal(typeof result.rss, "string", "rss should be a string");
                            tShowMemory.equal(typeof result.heapTotal, "string", "heapTotal should be a string");
                            tShowMemory.equal(typeof result.heapUsed, "string", "heapUsed should be a string");
                            tShowMemory.equal(typeof result.external, "string", "external should be a string");
                            tShowMemory.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
