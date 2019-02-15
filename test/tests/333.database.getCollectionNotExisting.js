const dbName = '__testAddCollectionWithOptions';
const collectionName = 'myCollectionNotExisting';


require('./client')(__filename, (test, client) => {
    test.test('loadDatabase', (subtest)  => {
        client.loadDatabase({ database:dbName }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.ok(typeof result, 'object', 'should return database properties');
            subtest.end();
        });
    });

    test.test('getCollection', (subtest)  => {
        client.getCollection({ collection: collectionName }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.deepEqual(result, null, 'should return '+collectionName+' properties');
            subtest.end();
        });
    });

});
