require('./client')(__filename, (test, client, end) => {
    test.test('listDatabases', subtest  => {
        client.listDatabases((err, result) => {
            subtest.deepEqual(typeof result, 'object', 'should return an array');
            subtest.deepEqual(result.length >=1, true, 'should have a length => 1');
            subtest.end();
            end();
        });
    });
});
