const dbName = '__testListCollection';

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        test.test('listCollections', (subtest)  => {
            client.listCollections((err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                subtest.deepEqual(result, [], 'should return empty array');
                subtest.end();
            });
        });
    });
});
