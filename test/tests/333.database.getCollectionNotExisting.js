const dbName = '__testAddCollectionWithOptions';
const collectionName = 'myCollectionNotExisting';


require('./client')(__filename, (test, client) => {
    test.test('loadDatabase', (subtest)  => {
        client.loadDatabase(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.ok(typeof result, 'object', 'should return database properties');
            subtest.end();
        });
    });

    test.test('getCollection', (subtest)  => {
        client.getCollection(collectionName, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.deepEqual(result, null, 'should return '+collectionName+' properties');
            subtest.end();
        });
    });

});
