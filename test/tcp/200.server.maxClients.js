const use = require('abrequire');
const Client = require('sloki-node-client');
const endpoint = require('../endpoints').tcp;
const ENV = use('src/env');

let maxClients = ENV.NET_TCP_MAX_CLIENTS;

require('./client')(__filename, (test, client) => {
    test.test('client1: getMaxClients', (subtest)  => {
        client.maxClients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, maxClients, 'client1: maxClients should return '+maxClients);
            subtest.end();
        });
    });

    test.test('client1: setMaxClients', (subtest)  => {
        maxClients=1;
        client.maxClients(maxClients, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, maxClients, 'client1: maxClients should be set to '+maxClients);
            subtest.end();
        });
    });

    test.test('client1: getMaxClients', (subtest)  => {
        client.maxClients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, maxClients, 'client1: maxClients should be '+maxClients);
            subtest.end();
        });
    });

    test.test('client2: hit maxClients', (subtest) => {
        const client2 = new Client(endpoint);
        client2
            .connect()
            .then(() => {
            })
            .catch((err) => {
                const expectedErr = { code: -32000, message: 'Max Clients Reached' };
                subtest.deepEqual(err, expectedErr, 'client2: should return '+JSON.stringify(expectedErr));
                setTimeout(subtest.end, 200);
            });
    });

    test.test('client1: restore maxClients', (subtest)  => {
        client.maxClients(ENV.NET_TCP_MAX_CLIENTS, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, ENV.NET_TCP_MAX_CLIENTS, 'client1: maxClients should be set to '+ENV.NET_TCP_MAX_CLIENTS);
            subtest.end();
        });
    });

});
