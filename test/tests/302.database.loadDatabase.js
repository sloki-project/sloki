const dbName = '__testUse';

require('./client')(__filename, (test, client) => {
    test.test('loadDatabase', (subtest)  => {
        client.loadDatabase({ database:dbName }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.deepEqual(typeof result, 'object', 'should return database properties');
            subtest.end();
        });
    });

    test.test('db', (subtest)  => {
        client.db((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.deepEqual(result, dbName, `current database should be ${dbName}`);
            subtest.end();
        });
    });
});
