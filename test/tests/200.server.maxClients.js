const Client = require('sloki-node-client');
const endpoint = require('../endpoints').tcp;
const config = require('../../src/config');

let maxClients = config.TCP_MAX_CLIENTS;

require('./client')(__filename, (test, client, end) => {
    test.test('client1: getMaxClients', subtest  => {
        client.maxClients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, maxClients, 'client1: maxClients should return '+maxClients);
            subtest.end();
        });
    });

    test.test('client1: setMaxClients', subtest  => {
        maxClients = 'a';
        client.maxClients({ value:maxClients }, (err) => {
            const expectedError = { code: -32602, message: 'method "maxClients": property "value" should be a number, found string' };
            subtest.deepEqual(err, expectedError, 'method should an return error');
            subtest.end();
        });
    });

    test.test('client1: setMaxClients', subtest  => {
        maxClients = 1;
        client.maxClients({ value:maxClients }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, maxClients, 'client1: maxClients should be set to '+maxClients);
            subtest.end();
        });
    });

    test.test('client1: getMaxClients', subtest  => {
        client.maxClients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, maxClients, 'client1: maxClients should be '+maxClients);
            subtest.end();
        });
    });

    test.test('client2: hit maxClients', subtest => {
        const client2 = new Client(endpoint);
        client2
            .connect()
            .then(() => {
            })
            .catch((err) => {
                const expectedErr = { code: -32000, message: 'Max Clients Reached' };
                subtest.deepEqual(err, expectedErr, 'client2: should return '+JSON.stringify(expectedErr));
                client2.close();
                setTimeout(subtest.end, 500);
            });
    });

    test.test('client1: restore maxClients', subtest  => {
        client.maxClients({ value:config.TCP_MAX_CLIENTS }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, config.TCP_MAX_CLIENTS, 'client1: maxClients should be set to '+config.TCP_MAX_CLIENTS);
            subtest.end();
            end();
        });
    });

});
