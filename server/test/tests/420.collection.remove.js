const dbName = '__testRemove_420_'+Date.now();
const collectionName = 'myCollection_'+Date.now();

const doc1 = { foo:'bar' };

const expectedErr1 = {
    code: -32603,
    message: 'Object is not a document stored in the collection'
};

const expectedErr2 = {
    code: -32602,
    message: 'method "remove": mandatory properties are missing (at least "collection, document" OR "collection, id")'
};

const expectedErr3 = {
    code: -32602,
    message: 'method "remove": mandatory properties conflict, please specify properties "collection, document" OR "collection, id"'
};

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database:dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.insert({ collection:collectionName, document:doc1 }, (err, result) => {

            test.deepEqual(err, undefined, 'insert should not return any error');
            test.deepEqual(typeof result, 'object', 'document inserted');

            test.test('remove a document by id should return removed document', subtest  => {
                client.remove({ collection:collectionName, id:1 }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    subtest.deepEqual(result, doc1, `should return ${JSON.stringify(doc1)}`);
                    subtest.end();
                });
            });

            test.test('remove a non existing document by id should return an error', subtest  => {
                client.remove({ collection:collectionName, id:2 }, (err, result) => {
                    subtest.deepEqual(err, expectedErr1, `should return error ${JSON.stringify(expectedErr1)}`);
                    subtest.deepEqual(result, undefined, 'result should be undefined');
                    subtest.end();
                });
            });

            test.test('missing document and id should return an error', subtest  => {
                client.remove({ collection:collectionName }, (err, result) => {
                    subtest.deepEqual(err, expectedErr2, `should return error ${JSON.stringify(expectedErr2)}`);
                    subtest.deepEqual(result, undefined, 'result should be undefined');
                    subtest.end();
                });
            });

            test.test('document and id specified should return an error', subtest  => {
                client.remove({ collection:collectionName, document:{}, id:1 }, (err, result) => {
                    subtest.deepEqual(err, expectedErr3, `should return error ${JSON.stringify(expectedErr3)}`);
                    subtest.deepEqual(result, undefined, 'result should be undefined');
                    subtest.end();
                });
            });

            test.test('empty doc {} should return an error', subtest  => {
                client.remove({ collection:collectionName, document:{} }, (err, result) => {
                    subtest.deepEqual(err, expectedErr1, `should return error ${JSON.stringify(expectedErr1)}`);
                    subtest.deepEqual(result, undefined, 'result should be undefined');
                    subtest.end();
                    end();
                });
            });
        });
    });
});
