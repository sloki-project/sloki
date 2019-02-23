const Client = require('../../../clients/node');
const config = require('../../src/config');
const engine = process.env.SLOKI_SERVER_ENGINE||'tcpbinary';
const endpoint = require('../endpoints')[engine];

const MAX_CLIENTS = config.getMaxClients(engine);

require('./client')(__filename, (test, client, end) => {
    test.test('client1: getMaxClients', subtest  => {
        client.maxClients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, MAX_CLIENTS, 'client1: maxClients should return '+MAX_CLIENTS);
            subtest.end();
        });
    });

    test.test('client1: setMaxClients', subtest  => {
        client.maxClients({ value:'a' }, (err) => {
            const expectedError = { code: -32602, message: 'method "maxClients": property "value" should be a number, found string' };
            subtest.deepEqual(err, expectedError, 'method should an return error');
            subtest.end();
        });
    });

    test.test('client1: setMaxClients', subtest  => {
        client.maxClients({ value:1 }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, 1, 'client1: maxClients should be set to 1');
            subtest.end();
        });
    });

    test.test('client1: getMaxClients', subtest  => {
        client.maxClients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, 1, 'client1: maxClients should be 1');
            subtest.end();
        });
    });

    test.test('client2: hit maxClients', subtest => {
        const client2 = new Client(endpoint, { engine });
        client2
            .connect()
            .then(() => {
                subtest.notOk('connect succeed, should not');
            })
            .catch((err) => {
                const expectedErr = { code: -32000, message: 'Max Clients Reached' };
                subtest.deepEqual(err, expectedErr, 'client2: should return '+JSON.stringify(expectedErr));
                client2.close();
                setTimeout(subtest.end, 500);
            });
    });

    test.test('client1: restore maxClients', subtest  => {
        client.maxClients({ value:MAX_CLIENTS }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result, MAX_CLIENTS, 'client1: maxClients should be set to '+MAX_CLIENTS);
            subtest.end();
            end();
        });
    });

});
