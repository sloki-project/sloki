require('./client')(__filename, (test, client, end) => {
    let connected = 1;
    if (client.protocol.match(/dinary/)) {
        connected = 2;
    }

    test.test('clients', subtest  => {
        client.clients((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.equal(result.length, connected, 'should return ${connected} client(s)');
            subtest.end();
            end();
        });
    });
});
