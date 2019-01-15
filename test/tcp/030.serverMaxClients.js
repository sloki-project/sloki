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
                    "client1: getMaxClients",
                    (tGetMaxClient)  => {
                        tcpClient.getMaxClients((err, result) => {
                            tGetMaxClient.deepEqual(err, undefined, 'command should not return an error');
                            tGetMaxClient.equal(
                                result,
                                maxClients,
                                "client1: maxClients should be "+maxClients
                            );
                            tGetMaxClient.end();
                        });
                    }
                )

                t.test(
                    "client1: setMaxClients",
                    (tSetMaxClient)  => {
                        maxClients=1;
                        tcpClient.setMaxClients(maxClients, (err, result) => {
                            tSetMaxClient.deepEqual(err, undefined, 'command should not return an error');
                            tSetMaxClient.equal(
                                result,
                                maxClients,
                                "client1: maxClients should be set to "+maxClients
                            );
                            tSetMaxClient.end();
                        });
                    }
                )

                t.test(
                    "client1: getMaxClients",
                    (tGetMaxClient)  => {
                        tcpClient.getMaxClients((err, result) => {
                            tGetMaxClient.deepEqual(err, undefined, 'command should not return an error');
                            tGetMaxClient.equal(
                                result,
                                maxClients,
                                "client1: maxClients should be "+maxClients
                            );
                            tGetMaxClient.end();
                        });
                    }
                )

                t.test(
                    "client2: hit maxClients",
                    (tHitMaxClient) => {
                        let tcpClient1 = new Client(endpoint);
                        tcpClient1
                            .connect()
                            .then((err) => {
                                t.deepEqual(err, undefined, 'connect should not return an error');

                                let expectedErr = { code: -32000, message: 'Max Clients Reached' };

                                tcpClient1.getMaxClients((err, result) => {
                                    tHitMaxClient.deepEqual(
                                        err,
                                        expectedErr,
                                        "client2: should return "+JSON.stringify(expectedErr)
                                    );
                                    // @FIXME: understand why calling directly tHitMaxClient.end() ake the next text fail
                                    setTimeout(tHitMaxClient.end,200);
                                });
                            })
                    }
                )

                t.test(
                    "client1: restore maxClients",
                    (tSetMaxClient)  => {
                        tcpClient.setMaxClients(ENV.NET_TCP_MAX_CLIENTS, (err, result) => {
                            tSetMaxClient.deepEqual(err, undefined, 'command should not return an error');

                            // @FIXME: see previous test
                            // in the previous test, if no setTimeout,
                            // err match with Max Clients Reached, result is undefined ...
                            tSetMaxClient.equal(
                                result,
                                ENV.NET_TCP_MAX_CLIENTS,
                                "client1: maxClients should be set to "+ENV.NET_TCP_MAX_CLIENTS
                            );
                            tSetMaxClient.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
