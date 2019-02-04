const dbName = '__testRemove_420_'+Date.now();
const collectionName = 'myCollection_'+Date.now();

const doc1 = { foo:'bar' };

const expectedErr1 = {
    code: -32603,
    message: 'Object is not a document stored in the collection'
};

const expectedErr2 = {
    code: -32602,
    message: 'remove: number of parameters should be at least 2'
};

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        client.insert(collectionName, doc1, (err, result) => {
            test.test('remove a document by id should return removed document', (subtest)  => {
                client.remove(collectionName, 1, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    subtest.deepEqual(result, doc1, `should return ${JSON.stringify(doc1)}`);
                    subtest.end();
                });
            });

            test.test('remove a non existing document by id should return an error', (subtest)  => {
                client.remove(collectionName, 2, (err, result) => {
                    subtest.deepEqual(err, expectedErr1, `should return error ${JSON.stringify(expectedErr1)}`);
                    subtest.end();
                });
            });

            test.test('missing doc or id should return an error', (subtest)  => {
                client.remove(collectionName, (err, result) => {
                    subtest.deepEqual(err, expectedErr2, `should return error ${JSON.stringify(expectedErr2)}`);
                    subtest.end();
                });
            });

            test.test('empty doc {} should return an error', (subtest)  => {
                client.remove(collectionName, {}, (err, result) => {
                    subtest.deepEqual(err, expectedErr1, `should return error ${JSON.stringify(expectedErr1)}`);
                    subtest.end();
                });
            });
        });
    });
});
