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
            .then(() => {
                t.test(
                    "showClients",
                    (tShowClients)  => {
                        tcpClient.showClients((err, result) => {
                            // example
                            // [ '127.0.0.1:1619' ]
                            t.equal(result.length,1,"should return only one connected client ");
                            tShowClients.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
