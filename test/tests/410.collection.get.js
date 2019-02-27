const dbName = '__testGet_410_'+Date.now();
const collectionName = 'insertAndGet_'+Date.now();
const doc = { foo: 'bar' };
const expected = {
    foo: 'bar',
    meta: {
        revision: 0,
        created: true, // can not test variable timestamp
        version: 0
    },
    $loki: 1
};

const expectedErr = {
    code: -32603,
    message: 'Object is not a document stored in the collection'
};

const ERROR_CODE_PARAMETER = -32602;

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database: dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        test.test('insert should return document', subtest  => {
            client.insert({ collection:collectionName, document:doc }, (err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                result.meta.created = typeof result.meta.created === 'number';
                subtest.deepEqual(result, expected, 'should return document');
                subtest.end();
            });
        });

        test.test('get should return error when collection does not exist', subtest  => {
            client.get({ collection:'unexistingCollection', id:1 }, (err, result) => {
                const expectedErr = {
                    code: ERROR_CODE_PARAMETER,
                    message: `collection unexistingCollection does not exist in database ${dbName}`
                };
                subtest.deepEqual(err, expectedErr, `should return error ${JSON.stringify(expectedErr)}`);
                subtest.deepEqual(result, undefined, 'should return undefined');
                subtest.end();
            });
        });

        test.test('get should return document', subtest  => {
            client.get({ collection:collectionName, id:1 }, (err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                result.meta.created = typeof result.meta.created === 'number';
                subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                subtest.end();
            });
        });

        test.test('get on a non existing document by id should return null', subtest  => {
            client.get({ collection:collectionName, id:10 }, (err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                subtest.deepEqual(result, undefined, `should return error ${JSON.stringify(expectedErr)}`);
                subtest.end();
                end();
            });
        });
    });
});
